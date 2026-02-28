import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AIProviderManager } from './services/ai-provider-manager.service';
import { AIServiceException } from './interfaces/ai-base.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private prisma: PrismaService,
    private aiProviderManager: AIProviderManager,
  ) {}

  /**
   * 获取当前 AI 提供商信息
   */
  getProviderInfo() {
    return {
      provider: this.aiProviderManager.getProviderName(),
      type: this.aiProviderManager.getProviderType(),
      isConfigured: this.aiProviderManager.isConfigured(),
    };
  }

  // ======== 营销文案生成 ========
  async generateMarketingCopy(userId: number, params: {
    product: string;
    targetAudience?: string;
    tone?: string;
    length?: string;
  }) {
    const { product, targetAudience, tone, length } = params;

    try {
      // 调用 AI 生成内容
      const aiResponse = await this.aiProviderManager.generateMarketingCopy({
        product,
        targetAudience,
        tone,
        length: length as 'short' | 'medium' | 'long',
      });

      const content = aiResponse.content;

      // 保存生成记录
      await this.prisma.generatedContent.create({
        data: {
          type: 'marketing-copy',
          prompt: JSON.stringify(params),
          content,
          userId,
        },
      });

      return {
        success: true,
        type: 'marketing-copy',
        product,
        content,
        suggestions: [
          '可以根据实际产品特点进行调整',
          '建议A/B测试不同版本的效果',
          '结合品牌调性优化文案风格',
        ],
      };
    } catch (error) {
      this.logger.error(`营销文案生成失败: ${error}`);

      // 如果是 AI 服务异常，提供友好错误消息
      if (error instanceof AIServiceException) {
        return {
          success: false,
          type: 'marketing-copy',
          product,
          error: error.message,
          content: null,
        };
      }

      throw error;
    }
  }

  // ======== 产品描述生成 ========
  async generateProductDesc(userId: number, params: {
    productName: string;
    features?: string[];
    style?: string;
  }) {
    const { productName, features, style } = params;

    try {
      // 调用 AI 生成内容
      const aiResponse = await this.aiProviderManager.generateProductDesc({
        productName,
        features,
        style,
      });

      const content = aiResponse.content;

      // 保存生成记录
      await this.prisma.generatedContent.create({
        data: {
          type: 'product-desc',
          prompt: JSON.stringify(params),
          content,
          userId,
        },
      });

      return {
        success: true,
        type: 'product-desc',
        productName,
        content,
        features: features || [],
        tips: [
          '添加具体数据增强可信度',
          '突出差异化竞争优势',
          '使用场景化描述吸引用户',
        ],
      };
    } catch (error) {
      this.logger.error(`产品描述生成失败: ${error}`);

      if (error instanceof AIServiceException) {
        return {
          success: false,
          type: 'product-desc',
          productName,
          error: error.message,
          content: null,
        };
      }

      throw error;
    }
  }

  // ======== 社交媒体内容生成 ========
  async generateSocialContent(userId: number, params: {
    platform: string;
    topic: string;
    style?: string;
    count?: number;
  }) {
    const { platform, topic, style, count } = params;
    const contentCount = count || 3;

    try {
      // 调用 AI 生成内容
      const aiResponse = await this.aiProviderManager.generateSocialContent({
        platform,
        topic,
        style,
        count,
      });

      // 解析 AI 返回的多条内容
      const contents = this.parseSocialContents(aiResponse.content, contentCount);

      // 保存生成记录
      for (const content of contents) {
        await this.prisma.generatedContent.create({
          data: {
            type: 'social-content',
            prompt: JSON.stringify(params),
            content: content.text,
            userId,
          },
        });
      }

      return {
        success: true,
        type: 'social-content',
        platform,
        topic,
        contents,
        tips: [
          '根据平台特性调整发布时间',
          '配合适当的话题标签增加曝光',
          '可以配合图片或视频提升互动',
        ],
      };
    } catch (error) {
      this.logger.error(`社交媒体内容生成失败: ${error}`);

      if (error instanceof AIServiceException) {
        return {
          success: false,
          type: 'social-content',
          platform,
          topic,
          error: error.message,
          contents: [],
        };
      }

      throw error;
    }
  }

  /**
   * 解析社交媒体内容
   */
  private parseSocialContents(content: string, count: number): Array<{ text: string; hashtags: string[] }> {
    const results = [];

    // 尝试使用分隔符分割
    const parts = content.split(/---+|___+/).map(p => p.trim()).filter(p => p);

    for (const part of parts.slice(0, count)) {
      // 提取话题标签
      const hashtags = this.extractHashtags(part);

      results.push({
        text: part,
        hashtags,
      });
    }

    // 如果解析失败，生成默认内容
    if (results.length === 0) {
      results.push({
        text: content,
        hashtags: [],
      });
    }

    return results;
  }

  /**
   * 提取话题标签
   */
  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\u4e00-\u9fa5a-zA-Z0-9_]+/g;
    const matches = text.match(hashtagRegex);
    return matches ? matches.map(tag => tag.substring(1)) : [];
  }

  // ======== 获取用户生成历史 ========
  async getUserGeneratedHistory(userId: number, type?: string, page = 1, pageSize = 10) {
    const where: any = { userId };
    if (type) {
      where.type = type;
    }

    const [contents, total] = await Promise.all([
      this.prisma.generatedContent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.generatedContent.count({ where }),
    ]);

    return {
      list: contents,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
