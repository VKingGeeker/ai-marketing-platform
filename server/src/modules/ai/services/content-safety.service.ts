import { Injectable, Logger } from '@nestjs/common';
import { ContentSafetyResult } from '../interfaces/ai-base.interface';

@Injectable()
export class ContentSafetyService {
  private readonly logger = new Logger(ContentSafetyService.name);

  // 敏感词列表 (可以根据需要扩展)
  private readonly sensitiveWords: string[] = [
    // 示例敏感词，实际请根据需求配置
    // 这些词仅作为示例
  ];

  // 需要过滤的字符模式
  private readonly sensitivePatterns: RegExp[] = [
    // 可以添加正则表达式模式
  ];

  /**
   * 检查内容安全性
   */
  checkContent(content: string): ContentSafetyResult {
    if (!content) {
      return {
        isSafe: true,
        filteredContent: content,
        issues: [],
      };
    }

    const issues: string[] = [];
    let filteredContent = content;

    // 检查敏感词
    for (const word of this.sensitiveWords) {
      if (content.includes(word)) {
        issues.push(`包含敏感词: ${word}`);
        // 替换敏感词
        filteredContent = filteredContent.replace(new RegExp(this.escapeRegex(word), 'g'), '***');
      }
    }

    // 检查敏感模式
    for (const pattern of this.sensitivePatterns) {
      if (pattern.test(content)) {
        issues.push(`包含敏感模式: ${pattern.source}`);
        filteredContent = filteredContent.replace(pattern, '***');
      }
    }

    const isSafe = issues.length === 0;

    if (!isSafe) {
      this.logger.warn(`内容安全检查发现问题: ${issues.join(', ')}`);
    }

    return {
      isSafe,
      filteredContent,
      issues,
    };
  }

  /**
   * 转义正则表达式特殊字符
   */
  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * 添加敏感词
   */
  addSensitiveWord(word: string): void {
    if (!this.sensitiveWords.includes(word)) {
      this.sensitiveWords.push(word);
    }
  }

  /**
   * 批量添加敏感词
   */
  addSensitiveWords(words: string[]): void {
    for (const word of words) {
      this.addSensitiveWord(word);
    }
  }

  /**
   * 移除敏感词
   */
  removeSensitiveWord(word: string): void {
    const index = this.sensitiveWords.indexOf(word);
    if (index > -1) {
      this.sensitiveWords.splice(index, 1);
    }
  }
}
