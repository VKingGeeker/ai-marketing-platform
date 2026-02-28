import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  // ======== 营销文案生成 ========
  async generateMarketingCopy(userId: number, params: {
    product: string;
    targetAudience?: string;
    tone?: string;
    length?: string;
  }) {
    const { product, targetAudience, tone, length } = params;

    // 模拟AI生成内容
    const content = this.mockGenerateMarketingCopy(product, targetAudience, tone, length);

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
  }

  // ======== 产品描述生成 ========
  async generateProductDesc(userId: number, params: {
    productName: string;
    features?: string[];
    style?: string;
  }) {
    const { productName, features, style } = params;

    // 模拟AI生成内容
    const content = this.mockGenerateProductDesc(productName, features, style);

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

    // 模拟AI生成多条内容
    const contents = this.mockGenerateSocialContent(platform, topic, style, contentCount);

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

  // ======== Mock 生成函数 ========
  private mockGenerateMarketingCopy(product: string, targetAudience?: string, tone?: string, length?: string): string {
    const audience = targetAudience || '目标用户';
    const toneStyle = tone || '专业';
    const len = length || 'medium';

    const templates = {
      short: `${product} - 为${audience}打造的优质选择！立即体验，让生活更美好。`,
      medium: `【${product}】—— 专为${audience}设计\n\n采用先进技术和优质材料，为您带来卓越的使用体验。${toneStyle}的风格，让每一次使用都成为享受。\n\n立即购买，开启品质生活新篇章！`,
      long: `【重磅推荐】${product}\n\n您是否在为寻找优质的${audience}产品而烦恼？我们为您带来了完美的解决方案！\n\n为什么选择${product}？\n✓ 品质卓越：精选材料，精湛工艺\n✓ ${toneStyle}风格：符合现代审美\n✓ 用户至上：贴心服务，售后无忧\n\n${audience}的明智之选，让每一次选择都值得期待。\n\n立即行动，让${product}成为您生活中的一部分！`,
    };

    return templates[len as keyof typeof templates] || templates.medium;
  }

  private mockGenerateProductDesc(productName: string, features?: string[], style?: string): string {
    const featureList = features || ['高品质', '易使用', '耐用性强'];
    const styleDesc = style || '现代简约';

    return `${productName}\n\n${productName}是一款精心打造的优质产品，采用${styleDesc}设计理念，为您带来卓越的使用体验。\n\n【核心特点】\n${featureList.map((f, i) => `${i + 1}. ${f}`).join('\n')}\n\n【产品优势】\n- 品质保证：严格的质量控制，确保每一件产品都符合高标准\n- 设计精美：${styleDesc}风格，彰显品位\n- 实用性强：满足日常使用需求\n- 性价比高：优质优价，物超所值\n\n${productName}，让品质生活触手可及。`;
  }

  private mockGenerateSocialContent(platform: string, topic: string, style?: string, count: number = 3): Array<{ text: string; hashtags: string[] }> {
    const styleDesc = style || '活泼';
    const results = [];

    const templates = [
      {
        text: `🔔 【${topic}】\n\n${styleDesc}来袭！✨\n\n还在为${topic}发愁吗？快来了解一下吧！\n\n#${topic} #智享AI #内容创作`,
        hashtags: [topic, '智享AI', '内容创作'],
      },
      {
        text: `📢 分享一个关于${topic}的小技巧：\n\n1. 先了解需求\n2. 选择合适的方案\n3. 持续优化改进\n\n你学到了吗？💡\n\n#${topic} #技巧分享 #学习笔记`,
        hashtags: [topic, '技巧分享', '学习笔记'],
      },
      {
        text: `🎉 今日${topic}推荐！\n\n${styleDesc}的内容来啦～\n\n感兴趣的小伙伴快来评论区聊聊吧！\n\n#${topic} #推荐 #互动`,
        hashtags: [topic, '推荐', '互动'],
      },
      {
        text: `💡 ${topic}小百科：\n\n知识点get✓\n\n${styleDesc}的方式，让你的${topic}更出色！\n\n#${topic} #知识分享 #成长`,
        hashtags: [topic, '知识分享', '成长'],
      },
      {
        text: `✨ ${topic}，你值得拥有！\n\n${styleDesc}呈现，让每一天都充满可能。\n\n让我们一起探索${topic}的无限可能吧！\n\n#${topic} #探索 #品质生活`,
        hashtags: [topic, '探索', '品质生活'],
      },
    ];

    for (let i = 0; i < count && i < templates.length; i++) {
      results.push(templates[i]);
    }

    return results;
  }
}
