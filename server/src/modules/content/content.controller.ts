import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ContentService } from './content.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller()
export class ContentController {
  constructor(private contentService: ContentService) {}

  // ======== 文章接口 ========
  @Get('articles')
  async getArticles(
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('category') category?: string,
  ) {
    return this.contentService.getArticles(
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 10,
      category,
    );
  }

  @Get('articles/mock')
  async getMockArticles() {
    return this.contentService.getMockArticles();
  }

  @Get('articles/:id')
  async getArticleById(@Param('id') id: string) {
    return this.contentService.getArticleById(parseInt(id));
  }

  // ======== 评论接口 ========
  @Get('articles/:id/comments')
  async getArticleComments(
    @Param('id') id: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
  ) {
    return this.contentService.getArticleComments(
      parseInt(id),
      page ? parseInt(page) : 1,
      pageSize ? parseInt(pageSize) : 20,
    );
  }

  @Post('comments')
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Request() req,
    @Body() body: { articleId: number; content: string; parentId?: number },
  ) {
    return this.contentService.createComment(
      body.articleId,
      req.user.id,
      body.content,
      body.parentId,
    );
  }
}
