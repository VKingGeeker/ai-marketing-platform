import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private prisma: PrismaService) {}

  async createFeedback(userId: number, data: {
    type: string;
    content: string;
    contact?: string;
  }) {
    const feedback = await this.prisma.feedback.create({
      data: {
        type: data.type,
        content: data.content,
        contact: data.contact || null,
        userId,
        status: 'pending',
      },
    });

    return {
      success: true,
      message: '反馈已提交，我们会尽快处理',
      feedback: {
        id: feedback.id,
        type: feedback.type,
        status: feedback.status,
        createdAt: feedback.createdAt,
      },
    };
  }

  async getUserFeedbacks(userId: number, page = 1, pageSize = 10) {
    const [feedbacks, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.feedback.count({ where: { userId } }),
    ]);

    return {
      list: feedbacks,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async getAllFeedbacks(page = 1, pageSize = 10, status?: string) {
    const where: any = {};
    if (status) {
      where.status = status;
    }

    const [feedbacks, total] = await Promise.all([
      this.prisma.feedback.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nickname: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.feedback.count({ where }),
    ]);

    return {
      list: feedbacks,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async updateFeedbackStatus(id: number, status: string) {
    const feedback = await this.prisma.feedback.update({
      where: { id },
      data: { status },
    });

    return feedback;
  }
}
