import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  // ======== 文章相关 ========
  async getArticles(page = 1, pageSize = 10, category?: string) {
    const where: any = { status: 'published' };
    if (category) {
      where.category = category;
    }

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true,
            },
          },
          _count: {
            select: { comments: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      list: articles,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getArticleById(id: number) {
    // 增加浏览量
    await this.prisma.article.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });

    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    return article;
  }

  async getArticleComments(articleId: number, page = 1, pageSize = 20) {
    const where = { articleId, parentId: null };

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true,
            },
          },
          replies: {
            include: {
              author: {
                select: {
                  id: true,
                  username: true,
                  nickname: true,
                  avatar: true,
                },
              },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.comment.count({ where: { articleId } }),
    ]);

    return {
      list: comments,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async createComment(articleId: number, authorId: number, content: string, parentId?: number) {
    // 验证文章存在
    const article = await this.prisma.article.findUnique({ where: { id: articleId } });
    if (!article) {
      throw new NotFoundException('文章不存在');
    }

    const comment = await this.prisma.comment.create({
      data: {
        content,
        articleId,
        authorId,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            nickname: true,
            avatar: true,
          },
        },
      },
    });

    return comment;
  }

  // ======== 模拟数据获取 ========
  async getMockArticles() {
    return [
      {
        id: 1,
        title: 'AI赋能内容创作：智享AI平台正式上线',
        summary: '智享AI平台是一款强大的AI内容生成工具，帮助用户快速生成营销文案、产品描述和社交媒体内容。',
        content: '智享AI平台是一款强大的AI内容生成工具，帮助用户快速生成营销文案、产品描述和社交媒体内容。平台采用先进的自然语言处理技术，为用户提供高质量的AI生成服务。',
        coverImage: 'https://picsum.photos/800/400?random=1',
        author: { id: 1, username: 'admin', nickname: '管理员', avatar: null },
        category: '公告',
        tags: 'AI,内容生成,上线',
        viewCount: 1250,
        createdAt: new Date('2024-01-15'),
      },
      {
        id: 2,
        title: '如何利用AI提升内容创作效率',
        summary: '本文介绍如何利用AI工具提升内容创作效率，包括营销文案、产品描述等方面的技巧。',
        content: '在当今快节奏的数字时代，内容创作需求日益增长。AI工具可以帮助创作者快速生成初稿，节省大量时间。本文将介绍如何有效利用AI工具提升创作效率。',
        coverImage: 'https://picsum.photos/800/400?random=2',
        author: { id: 2, username: 'editor', nickname: '编辑', avatar: null },
        category: '教程',
        tags: 'AI,效率,教程',
        viewCount: 856,
        createdAt: new Date('2024-01-20'),
      },
      {
        id: 3,
        title: '营销文案写作技巧大揭秘',
        summary: '优秀的营销文案是产品成功的关键，本文分享一些实用的营销文案写作技巧。',
        content: '营销文案是连接产品与用户的桥梁，一篇优秀的营销文案能够有效提升转化率。本文将从多个角度分析如何写出高质量的营销文案。',
        coverImage: 'https://picsum.photos/800/400?random=3',
        author: { id: 1, username: 'admin', nickname: '管理员', avatar: null },
        category: '技巧',
        tags: '营销,文案,技巧',
        viewCount: 623,
        createdAt: new Date('2024-01-25'),
      },
    ];
  }
}
