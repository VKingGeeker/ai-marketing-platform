import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import {
  AIBaseService,
  AIResponse,
  MarketingCopyParams,
  ProductDescParams,
  SocialContentParams,
  AIServiceException,
} from '../interfaces/ai-base.interface';
import { ConfigService } from '../../../config/config.service';
import { ContentSafetyService } from '../services/content-safety.service';

@Injectable()
export class SiliconFlowService implements AIBaseService {
  private readonly logger = new Logger(SiliconFlowService.name);
  private readonly client: AxiosInstance;
  private readonly model: string;
  private readonly timeout: number;
  private readonly maxContentLength: number;

  constructor(
    private configService: ConfigService,
    private contentSafetyService: ContentSafetyService,
  ) {
    this.model = this.configService.siliconflowModel;
    this.timeout = this.configService.aiRequestTimeout;
    this.maxContentLength = this.configService.aiMaxContentLength;

    this.client = axios.create({
      baseURL: this.configService.siliconflowBaseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.configService.siliconflowApiKey}`,
      },
    });
  }

  getProviderName(): string {
    return 'SiliconFlow';
  }

  /**
   * 生成营销文案
   */
  async generateMarketingCopy(params: MarketingCopyParams): Promise<AIResponse> {
    const { product, targetAudience, tone, length } = params;

    // 构建优化的提示词
    const prompt = this.buildMarketingCopyPrompt({
      product,
      targetAudience: targetAudience || '目标用户',
      tone: tone || '专业、亲切',
      length: length || 'medium',
    });

    try {
      const response = await this.callAI(prompt);

      // 内容安全检查
      const safetyResult = this.contentSafetyService.checkContent(response);

      if (!safetyResult.isSafe) {
        this.logger.warn(`营销文案包含敏感内容: ${safetyResult.issues.join(', ')}`);
      }

      // 限制内容长度
      const limitedContent = this.truncateContent(
        safetyResult.filteredContent,
        this.maxContentLength,
      );

      return {
        success: true,
        content: limitedContent,
      };
    } catch (error) {
      this.logger.error(`SiliconFlow 生成营销文案失败: ${error}`);
      throw new AIServiceException(
        '营销文案生成失败',
        this.getProviderName(),
        error?.response?.status,
        error,
      );
    }
  }

  /**
   * 生成产品描述
   */
  async generateProductDesc(params: ProductDescParams): Promise<AIResponse> {
    const { productName, features, style } = params;

    const prompt = this.buildProductDescPrompt({
      productName,
      features: features || [],
      style: style || '现代简约',
    });

    try {
      const response = await this.callAI(prompt);

      const safetyResult = this.contentSafetyService.checkContent(response);

      if (!safetyResult.isSafe) {
        this.logger.warn(`产品描述包含敏感内容: ${safetyResult.issues.join(', ')}`);
      }

      const limitedContent = this.truncateContent(
        safetyResult.filteredContent,
        this.maxContentLength,
      );

      return {
        success: true,
        content: limitedContent,
      };
    } catch (error) {
      this.logger.error(`SiliconFlow 生成产品描述失败: ${error}`);
      throw new AIServiceException(
        '产品描述生成失败',
        this.getProviderName(),
        error?.response?.status,
        error,
      );
    }
  }

  /**
   * 生成社交媒体内容
   */
  async generateSocialContent(params: SocialContentParams): Promise<AIResponse> {
    const { platform, topic, style, count } = params;

    const prompt = this.buildSocialContentPrompt({
      platform,
      topic,
      style: style || '活泼、有趣',
      count: count || 3,
    });

    try {
      const response = await this.callAI(prompt);

      const safetyResult = this.contentSafetyService.checkContent(response);

      if (!safetyResult.isSafe) {
        this.logger.warn(`社交媒体内容包含敏感内容: ${safetyResult.issues.join(', ')}`);
      }

      const limitedContent = this.truncateContent(
        safetyResult.filteredContent,
        this.maxContentLength * (count || 3),
      );

      return {
        success: true,
        content: limitedContent,
      };
    } catch (error) {
      this.logger.error(`SiliconFlow 生成社交媒体内容失败: ${error}`);
      throw new AIServiceException(
        '社交媒体内容生成失败',
        this.getProviderName(),
        error?.response?.status,
        error,
      );
    }
  }

  /**
   * 调用 SiliconFlow API
   */
  private async callAI(prompt: string): Promise<string> {
    const apiKey = this.configService.siliconflowApiKey;

    if (!apiKey || apiKey === 'your-siliconflow-api-key') {
      throw new AIServiceException(
        'SiliconFlow API Key 未配置',
        this.getProviderName(),
      );
    }

    try {
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的营销文案专家，擅长为中国中小商户创作吸引人的营销内容。文案要接地气、易懂、有感染力。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      });

      const content = response.data?.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error('API 返回内容为空');
      }

      return content;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          throw new AIServiceException(
            'SiliconFlow API Key 无效',
            this.getProviderName(),
            status,
            error,
          );
        } else if (status === 400) {
          throw new AIServiceException(
            `API 请求参数错误: ${data?.error?.message || '未知错误'}`,
            this.getProviderName(),
            status,
            error,
          );
        } else if (status === 429) {
          throw new AIServiceException(
            'API 请求频率超限，请稍后重试',
            this.getProviderName(),
            status,
            error,
          );
        }
      }

      throw error;
    }
  }

  /**
   * 构建营销文案提示词
   */
  private buildMarketingCopyPrompt(params: {
    product: string;
    targetAudience: string;
    tone: string;
    length: string;
  }): string {
    const { product, targetAudience, tone, length } = params;

    let lengthDesc = '';
    switch (length) {
      case 'short':
        lengthDesc = '简短有力，30-50字左右';
        break;
      case 'long':
        lengthDesc = '详细丰富，300-500字左右';
        break;
      default:
        lengthDesc = '适中，100-200字左右';
    }

    return `请为以下产品撰写营销文案：

产品名称：${product}
目标受众：${targetAudience}
文案风格：${tone}
长度要求：${lengthDesc}

要求：
1. 语言通俗易懂，适合中国普通消费者阅读
2. 突出产品核心卖点
3. 具有感染力和号召力
4. 可以适当使用emoji增加趣味性
5. 如果是短文案，最多生成3个版本供选择

请直接输出文案内容，不要添加额外说明。`;
  }

  /**
   * 构建产品描述提示词
   */
  private buildProductDescPrompt(params: {
    productName: string;
    features: string[];
    style: string;
  }): string {
    const { productName, features, style } = params;

    return `请为以下产品撰写吸引人的产品描述：

产品名称：${productName}
产品特点：${features.join('、')}
风格：${style}

要求：
1. 电商风格，富有吸引力
2. 突出产品优势和差异化特点
3. 语言生动有趣，激发购买欲望
4. 可以适当使用emoji
5. 结构清晰，包含核心特点和产品优势

请直接输出产品描述内容，不要添加额外说明。`;
  }

  /**
   * 构建社交媒体内容提示词
   */
  private buildSocialContentPrompt(params: {
    platform: string;
    topic: string;
    style: string;
    count: number;
  }): string {
    const { platform, topic, style, count } = params;

    let platformTips = '';
    switch (platform.toLowerCase()) {
      case 'weibo':
      case '微博':
        platformTips = '微博风格：简短有趣，适合话题互动，可带热门话题标签';
        break;
      case 'wechat':
      case '微信':
        platformTips = '微信公众号风格：深度有价值，适合知识分享';
        break;
      case 'douyin':
      case '抖音':
        platformTips = '抖音风格：短视频文案，活泼有趣，节奏快';
        break;
      case 'xiaohongshu':
      case '小红书':
        platformTips = '小红书风格：真实体验分享，种草推荐，图文并茂';
        break;
      default:
        platformTips = '通用社交媒体风格';
    }

    return `请为以下主题生成${count}条社交媒体发布内容：

主题：${topic}
平台：${platform}
风格：${style}
数量：${count}条

${platformTips}

要求：
1. 每条内容都要有吸引力的开头
2. 适合目标受众阅读
3. 可以适当添加相关话题标签
4. 内容真实有趣，不生硬
5. 每条内容用"---分隔线---"分隔

请直接输出内容，不要添加额外说明。`;
  }

  /**
   * 截断内容
   */
  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }

    // 尝试在句号、逗号等标点处截断
    const truncated = content.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('。');
    const lastComma = truncated.lastIndexOf('，');
    const lastNewline = truncated.lastIndexOf('\n');

    const lastSplit = Math.max(lastPeriod, lastComma, lastNewline);

    if (lastSplit > maxLength * 0.7) {
      return content.substring(0, lastSplit + 1);
    }

    return truncated + '...';
  }
}
