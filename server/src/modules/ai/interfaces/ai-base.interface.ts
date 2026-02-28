/**
 * AI 服务基础接口
 * 定义所有 AI 服务提供商需要实现的接口
 */

// 营销文案参数
export interface MarketingCopyParams {
  product: string;
  targetAudience?: string;
  tone?: string;
  length?: 'short' | 'medium' | 'long';
}

// 产品描述参数
export interface ProductDescParams {
  productName: string;
  features?: string[];
  style?: string;
}

// 社交媒体内容参数
export interface SocialContentParams {
  platform: string;
  topic: string;
  style?: string;
  count?: number;
}

// AI 响应结果
export interface AIResponse {
  success: boolean;
  content: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// AI 服务提供商类型
export type AIProviderType = 'siliconflow' | 'openai' | 'moonshot';

/**
 * AI 基础服务接口
 * 所有 AI 服务提供商都需要实现此接口
 */
export interface AIBaseService {
  // 获取提供商名称
  getProviderName(): string;

  // 生成营销文案
  generateMarketingCopy(params: MarketingCopyParams): Promise<AIResponse>;

  // 生成产品描述
  generateProductDesc(params: ProductDescParams): Promise<AIResponse>;

  // 生成社交媒体内容
  generateSocialContent(params: SocialContentParams): Promise<AIResponse>;
}

/**
 * 内容安全检查结果
 */
export interface ContentSafetyResult {
  isSafe: boolean;
  filteredContent: string;
  issues: string[];
}

/**
 * AI 服务异常类
 */
export class AIServiceException extends Error {
  constructor(
    message: string,
    public provider: string,
    public statusCode?: number,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = 'AIServiceException';
  }
}
