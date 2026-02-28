import { Controller, Post, Get, Body, Query, UseGuards, Request, Put, Param } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFeedback(
    @Request() req,
    @Body() body: {
      type: string;
      content: string;
      contact?: string;
    },
  ) {
    return this.feedbackService.createFeedback(req.user.id, body);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyFeedbacks(
    @Request() req,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.feedbackService.getUserFeedbacks(
      req.user.id,
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 10,
    );
  }

  // 管理员接口
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllFeedbacks(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('status') status?: string,
  ) {
    return this.feedbackService.getAllFeedbacks(
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 10,
      status,
    );
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateFeedbackStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.feedbackService.updateFeedbackStatus(parseInt(id), body.status);
  }
}
