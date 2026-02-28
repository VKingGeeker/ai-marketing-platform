import { Controller, Post, Get, Body, Query, UseGuards, Request } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('marketing-copy')
  @UseGuards(JwtAuthGuard)
  async generateMarketingCopy(
    @Request() req,
    @Body() body: {
      product: string;
      targetAudience?: string;
      tone?: string;
      length?: string;
    },
  ) {
    return this.aiService.generateMarketingCopy(req.user.id, body);
  }

  @Post('product-desc')
  @UseGuards(JwtAuthGuard)
  async generateProductDesc(
    @Request() req,
    @Body() body: {
      productName: string;
      features?: string[];
      style?: string;
    },
  ) {
    return this.aiService.generateProductDesc(req.user.id, body);
  }

  @Post('social-content')
  @UseGuards(JwtAuthGuard)
  async generateSocialContent(
    @Request() req,
    @Body() body: {
      platform: string;
      topic: string;
      style?: string;
      count?: number;
    },
  ) {
    return this.aiService.generateSocialContent(req.user.id, body);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getUserGeneratedHistory(
    @Request() req,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.aiService.getUserGeneratedHistory(
      req.user.id,
      type,
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 10,
    );
  }
}
