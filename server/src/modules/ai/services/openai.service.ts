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
export class OpenAIService implements AIBaseService {
  private readonly logger = new Logger(OpenAIService.name);
  private readonly client: AxiosInstance;
  private readonly model: string;
  private readonly timeout: number;
  private readonly maxContentLength: number;

  constructor(
    private configService: ConfigService,
    private contentSafetyService: ContentSafetyService,
  ) {
    this.model = this.configService.openaiModel;
    this.timeout = this.configService.aiRequestTimeout;
    this.maxContentLength = this.configService.aiMaxContentLength;

    this.client = axios.create({
      baseURL: this.configService.openaiBaseUrl,
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.configService.openaiApiKey}`,
      },
    });
  }

  getProviderName(): string {
    return 'OpenAI';
  }

  async generateMarketingCopy(params: MarketingCopyParams): Promise<AIResponse> {
    const { product, targetAudience, tone, length } = params;

    const prompt = this.buildMarketingCopyPrompt({
      product,
      targetAudience: targetAudience || 'target users',
      tone: tone || 'professional and friendly',
      length: length || 'medium',
    });

    try {
      const response = await this.callAI(prompt);
      const safetyResult = this.contentSafetyService.checkContent(response);

      if (!safetyResult.isSafe) {
        this.logger.warn(`Marketing copy contains sensitive content: ${safetyResult.issues.join(', ')}`);
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
      this.logger.error(`OpenAI generating marketing copy failed: ${error}`);
      throw new AIServiceException(
        'Marketing copy generation failed',
        this.getProviderName(),
        error?.response?.status,
        error,
      );
    }
  }

  async generateProductDesc(params: ProductDescParams): Promise<AIResponse> {
    const { productName, features, style } = params;

    const prompt = this.buildProductDescPrompt({
      productName,
      features: features || [],
      style: style || 'modern and simple',
    });

    try {
      const response = await this.callAI(prompt);
      const safetyResult = this.contentSafetyService.checkContent(response);

      if (!safetyResult.isSafe) {
        this.logger.warn(`Product description contains sensitive content: ${safetyResult.issues.join(', ')}`);
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
      this.logger.error(`OpenAI generating product description failed: ${error}`);
      throw new AIServiceException(
        'Product description generation failed',
        this.getProviderName(),
        error?.response?.status,
        error,
      );
    }
  }

  async generateSocialContent(params: SocialContentParams): Promise<AIResponse> {
    const { platform, topic, style, count } = params;

    const prompt = this.buildSocialContentPrompt({
      platform,
      topic,
      style: style || 'friendly and interesting',
      count: count || 3,
    });

    try {
      const response = await this.callAI(prompt);
      const safetyResult = this.contentSafetyService.checkContent(response);

      if (!safetyResult.isSafe) {
        this.logger.warn(`Social media content contains sensitive content: ${safetyResult.issues.join(', ')}`);
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
      this.logger.error(`OpenAI generating social media content failed: ${error}`);
      throw new AIServiceException(
        'Social media content generation failed',
        this.getProviderName(),
        error?.response?.status,
        error,
      );
    }
  }

  private async callAI(prompt: string): Promise<string> {
    const apiKey = this.configService.openaiApiKey;

    if (!apiKey || apiKey === 'your-openai-api-key') {
      throw new AIServiceException(
        'OpenAI API Key not configured',
        this.getProviderName(),
      );
    }

    try {
      const response = await this.client.post('/chat/completions', {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional marketing copywriter, expert at creating attractive marketing content for small and medium businesses.',
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
        throw new Error('API returned empty content');
      }

      return content;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (status === 401) {
          throw new AIServiceException(
            'OpenAI API Key is invalid',
            this.getProviderName(),
            status,
            error,
          );
        } else if (status === 400) {
          throw new AIServiceException(
            `API request parameter error: ${data?.error?.message || 'Unknown error'}`,
            this.getProviderName(),
            status,
            error,
          );
        } else if (status === 429) {
          throw new AIServiceException(
            'API rate limit exceeded, please try again later',
            this.getProviderName(),
            status,
            error,
          );
        } else if (status === 500) {
          throw new AIServiceException(
            'OpenAI server error, please try again later',
            this.getProviderName(),
            status,
            error,
          );
        }
      }

      throw error;
    }
  }

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
        lengthDesc = 'concise and powerful, about 30-50 characters';
        break;
      case 'long':
        lengthDesc = 'detailed and rich, about 300-500 characters';
        break;
      default:
        lengthDesc = 'moderate, about 100-200 characters';
    }

    return `Please write marketing copy for the following product:

Product Name: ${product}
Target Audience: ${targetAudience}
Copy Style: ${tone}
Length Requirement: ${lengthDesc}

Requirements:
1. Language should be easy to understand for average consumers
2. Highlight the product's core selling points
3. Be compelling and have a call to action
4. Can appropriately use emojis to add fun
5. If it's a short copy, generate up to 3 versions for selection

Please directly output the copy content without additional explanations.`;
  }

  private buildProductDescPrompt(params: {
    productName: string;
    features: string[];
    style: string;
  }): string {
    const { productName, features, style } = params;

    return `Please write an attractive product description for the following product:

Product Name: ${productName}
Product Features: ${features.join(', ')}
Style: ${style}

Requirements:
1. E-commerce style, attractive
2. Highlight product advantages and differentiation
3. Vivid and interesting language to stimulate purchase desire
4. Can appropriately use emojis
5. Clear structure, including core features and product advantages

Please directly output the product description without additional explanations.`;
  }

  private buildSocialContentPrompt(params: {
    platform: string;
    topic: string;
    style: string;
    count: number;
  }): string {
    const { platform, topic, style, count } = params;

    let platformTips = '';
    switch (platform.toLowerCase()) {
      case 'twitter':
      case 'x':
        platformTips = 'Twitter style: concise and interesting, suitable for topic interaction, can include trending hashtags';
        break;
      case 'facebook':
        platformTips = 'Facebook style: more detailed, suitable for community engagement';
        break;
      case 'instagram':
        platformTips = 'Instagram style: visual-focused, short and catchy captions';
        break;
      case 'linkedin':
        platformTips = 'LinkedIn style: professional, suitable for industry insights and professional content';
        break;
      default:
        platformTips = 'General social media style';
    }

    return `Please generate ${count} social media posts for the following topic:

Topic: ${topic}
Platform: ${platform}
Style: ${style}
Quantity: ${count} posts

${platformTips}

Requirements:
1. Each post should have an attractive opening
2. Suitable for target audience
3. Can appropriately add relevant topic hashtags
4. Authentic and interesting content
5. Separate each post with "---DIVIDER---"

Please directly output the content without additional explanations.`;
  }

  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) {
      return content;
    }

    const truncated = content.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    const lastComma = truncated.lastIndexOf(',');
    const lastNewline = truncated.lastIndexOf('\n');

    const lastSplit = Math.max(lastPeriod, lastComma, lastNewline);

    if (lastSplit > maxLength * 0.7) {
      return content.substring(0, lastSplit + 1);
    }

    return truncated + '...';
  }
}
