import { Injectable, Logger } from '@nestjs/common';
import {
  AIBaseService,
  AIProviderType,
  AIResponse,
  MarketingCopyParams,
  ProductDescParams,
  SocialContentParams,
  AIServiceException,
} from '../interfaces/ai-base.interface';
import { ConfigService } from '../../../config/config.service';
import { SiliconFlowService } from './siliconflow.service';
import { OpenAIService } from './openai.service';
import { MoonshotService } from './moonshot.service';

@Injectable()
export class AIProviderManager implements AIBaseService {
  private readonly logger = new Logger(AIProviderManager.name);
  private currentProvider: AIBaseService;
  private readonly providerType: AIProviderType;

  constructor(
    private configService: ConfigService,
    private siliconFlowService: SiliconFlowService,
    private openAIService: OpenAIService,
    private moonshotService: MoonshotService,
  ) {
    // 获取配置的 AI 提供商类型
    this.providerType = this.configService.aiProvider as AIProviderType;

    // 根据配置初始化 AI 提供商
    this.currentProvider = this.initializeProvider();

    this.logger.log(`AI Provider Manager 初始化完成，当前提供商: ${this.getProviderName()}`);
  }

  /**
   * 根据配置初始化 AI 提供商
   */
  private initializeProvider(): AIBaseService {
    const provider = this.configService.aiProvider;

    switch (provider) {
      case 'openai':
        // 检查 OpenAI API Key 是否配置
        if (!this.configService.openaiApiKey || this.configService.openaiApiKey === 'your-openai-api-key') {
          this.logger.warn('OpenAI API Key 未配置，将回退到 SiliconFlow');
          return this.siliconFlowService;
        }
        this.logger.log('使用 OpenAI 作为 AI 提供商');
        return this.openAIService;

      case 'moonshot':
        // 检查 Moonshot API Key 是否配置
        if (!this.configService.moonshotApiKey || this.configService.moonshotApiKey === 'your-moonshot-api-key') {
          this.logger.warn('Moonshot API Key 未配置，将回退到 SiliconFlow');
          return this.siliconFlowService;
        }
        this.logger.log('使用 Moonshot (月之暗面) 作为 AI 提供商');
        return this.moonshotService;

      case 'siliconflow':
      default:
        // 检查 SiliconFlow API Key 是否配置
        if (!this.configService.siliconflowApiKey || this.configService.siliconflowApiKey === 'your-siliconflow-api-key') {
          this.logger.warn('SiliconFlow API Key 未配置，将使用模拟数据');
          // 返回 null，稍后使用 mock
          return null;
        }
        this.logger.log('使用 SiliconFlow 作为 AI 提供商');
        return this.siliconFlowService;
    }
  }

  /**
   * 切换 AI 提供商
   */
  switchProvider(providerType: AIProviderType): void {
    switch (providerType) {
      case 'openai':
        this.currentProvider = this.openAIService;
        break;
      case 'moonshot':
        this.currentProvider = this.moonshotService;
        break;
      case 'siliconflow':
      default:
        this.currentProvider = this.siliconFlowService;
        break;
    }

    this.logger.log(`已切换 AI 提供商至: ${this.getProviderName()}`);
  }

  /**
   * 获取当前提供商名称
   */
  getProviderName(): string {
    if (!this.currentProvider) {
      return 'Mock (未配置 API Key)';
    }
    return this.currentProvider.getProviderName();
  }

  /**
   * 获取当前提供商类型
   */
  getProviderType(): AIProviderType {
    return this.providerType;
  }

  /**
   * 检查是否已配置有效的 API Key
   */
  isConfigured(): boolean {
    return this.currentProvider !== null;
  }

  /**
   * 生成营销文案
   */
  async generateMarketingCopy(params: MarketingCopyParams): Promise<AIResponse> {
    if (!this.currentProvider) {
      // 如果没有配置 AI，使用模拟数据
      return this.getMockResponse('marketing-copy', params);
    }

    try {
      return await this.currentProvider.generateMarketingCopy(params);
    } catch (error) {
      this.logger.error(`生成营销文案失败: ${error}`);

      // 错误处理：尝试降级到其他提供商
      if (this.canFallback()) {
        this.logger.warn('AI 服务调用失败，尝试使用备用方案');
        return this.getFallbackResponse('marketing-copy', params);
      }

      throw error;
    }
  }

  /**
   * 生成产品描述
   */
  async generateProductDesc(params: ProductDescParams): Promise<AIResponse> {
    if (!this.currentProvider) {
      return this.getMockResponse('product-desc', params);
    }

    try {
      return await this.currentProvider.generateProductDesc(params);
    } catch (error) {
      this.logger.error(`生成产品描述失败: ${error}`);

      if (this.canFallback()) {
        this.logger.warn('AI 服务调用失败，尝试使用备用方案');
        return this.getFallbackResponse('product-desc', params);
      }

      throw error;
    }
  }

  /**
   * 生成社交媒体内容
   */
  async generateSocialContent(params: SocialContentParams): Promise<AIResponse> {
    if (!this.currentProvider) {
      return this.getMockResponse('social-content', params);
    }

    try {
      return await this.currentProvider.generateSocialContent(params);
    } catch (error) {
      this.logger.error(`生成社交媒体内容失败: ${error}`);

      if (this.canFallback()) {
        this.logger.warn('AI 服务调用失败，尝试使用备用方案');
        return this.getFallbackResponse('social-content', params);
      }

      throw error;
    }
  }

  /**
   * 检查是否可以降级
   */
  private canFallback(): boolean {
    // 检查是否有其他可用的提供商
    const hasSiliconFlow = this.configService.siliconflowApiKey &&
      this.configService.siliconflowApiKey !== 'your-siliconflow-api-key';
    const hasOpenAI = this.configService.openaiApiKey &&
      this.configService.openaiApiKey !== 'your-openai-api-key';
    const hasMoonshot = this.configService.moonshotApiKey &&
      this.configService.moonshotApiKey !== 'your-moonshot-api-key';

    return hasSiliconFlow || hasOpenAI || hasMoonshot;
  }

  /**
   * 获取降级响应
   */
  private async getFallbackResponse(
    type: string,
    params: MarketingCopyParams | ProductDescParams | SocialContentParams,
  ): Promise<AIResponse> {
    // 尝试使用 SiliconFlow 作为备用
    if (this.configService.siliconflowApiKey &&
      this.configService.siliconflowApiKey !== 'your-siliconflow-api-key') {
      this.logger.log('尝试使用 SiliconFlow 作为备用提供商');
      this.currentProvider = this.siliconFlowService;

      try {
        switch (type) {
          case 'marketing-copy':
            return await this.siliconFlowService.generateMarketingCopy(params as MarketingCopyParams);
          case 'product-desc':
            return await this.siliconFlowService.generateProductDesc(params as ProductDescParams);
          case 'social-content':
            return await this.siliconFlowService.generateSocialContent(params as SocialContentParams);
        }
      } catch (error) {
        this.logger.error(`SiliconFlow 备用方案也失败: ${error}`);
      }
    }

    // 如果所有方案都失败，使用模拟数据
    this.logger.warn('所有 AI 提供商都不可用，使用模拟数据');
    return this.getMockResponse(type, params);
  }

  /**
   * 获取模拟响应 (当没有配置 API Key 时使用)
   */
  private getMockResponse(
    type: string,
    params: MarketingCopyParams | ProductDescParams | SocialContentParams,
  ): AIResponse {
    let content = '';

    switch (type) {
      case 'marketing-copy':
        const marketingParams = params as MarketingCopyParams;
        content = this.generateMockMarketingCopy(
          marketingParams.product,
          marketingParams.targetAudience,
          marketingParams.tone,
          marketingParams.length,
        );
        break;

      case 'product-desc':
        const productParams = params as ProductDescParams;
        content = this.generateMockProductDesc(
          productParams.productName,
          productParams.features,
          productParams.style,
        );
        break;

      case 'social-content':
        const socialParams = params as SocialContentParams;
        content = this.generateMockSocialContent(
          socialParams.platform,
          socialParams.topic,
          socialParams.style,
          socialParams.count,
        );
        break;
    }

    return {
      success: true,
      content,
    };
  }

  /**
   * 生成模拟营销文案
   */
  private generateMockMarketingCopy(
    product: string,
    targetAudience?: string,
    tone?: string,
    length?: string,
  ): string {
    const audience = targetAudience || '目标用户';
    const toneStyle = tone || '专业';
    const len = length || 'medium';

    const templates = {
      short: `${product} - 为${audience}打造的优质选择！立即体验，让生活更美好。`,
      medium: `【${product}】—— 专为${audience}设计

采用先进技术和优质材料，为您带来卓越的使用体验。${toneStyle}的风格，让每一次使用都成为享受。

立即购买，开启品质生活新篇章！`,
      long: `【重磅推荐】${product}

您是否在为寻找优质的${audience}产品而烦恼？我们为您带来了完美的解决方案！

为什么选择${product}？
✓ 品质卓越：精选材料，精湛工艺
✓ ${toneStyle}风格：符合现代审美
✓ 用户至上：贴心服务，售后无忧

${audience}的明智之选，让每一次选择都值得期待。

立即行动，让${product}成为您生活中的一部分！`,
    };

    return templates[len as keyof typeof templates] || templates.medium;
  }

  /**
   * 生成模拟产品描述
   */
  private generateMockProductDesc(
    productName: string,
    features?: string[],
    style?: string,
  ): string {
    const featureList = features || ['高品质', '易使用', '耐用性强'];
    const styleDesc = style || '现代简约';

    return `${productName}

${productName}是一款精心打造的优质产品，采用${styleDesc}设计理念，为您带来卓越的使用体验。

【核心特点】
${featureList.map((f, i) => `${i + 1}. ${f}`).join('\n')}

【产品优势】
- 品质保证：严格的质量控制，确保每一件产品都符合高标准
- 设计精美：${styleDesc}风格，彰显品位
- 实用性强：满足日常使用需求
- 性价比高：优质优价，物超所值

${productName}，让品质生活触手可及。`;
  }

  /**
   * 生成模拟社交媒体内容
   */
  private generateMockSocialContent(
    platform: string,
    topic: string,
    style?: string,
    count: number = 3,
  ): string {
    const styleDesc = style || '活泼';
    const results = [];

    const templates = [
      {
        text: `【${topic}】

${styleDesc}来袭！

还在为${topic}发愁吗？快来了解一下吧！

#${topic} #智享AI #内容创作`,
        hashtags: [topic, '智享AI', '内容创作'],
      },
      {
        text: `分享一个关于${topic}的小技巧：

1. 先了解需求
2. 选择合适的方案
3. 持续优化改进

你学到了吗？

#${topic} #技巧分享 #学习笔记`,
        hashtags: [topic, '技巧分享', '学习笔记'],
      },
      {
        text: `今日${topic}推荐！

${styleDesc}的内容来啦～

感兴趣的小伙伴快来评论区聊聊吧！

#${topic} #推荐 #互动`,
        hashtags: [topic, '推荐', '互动'],
      },
    ];

    return templates.slice(0, count).map(t => t.text).join('\n\n---\n\n');
  }
}
