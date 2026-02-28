import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private config: EnvConfig;

  constructor() {
    this.config = this.loadEnvConfig();
  }

  private loadEnvConfig(): EnvConfig {
    const envPath = path.join(process.cwd(), '.env');
    const config: EnvConfig = {};

    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf-8');
      const lines = envContent.split('\n');

      for (const line of lines) {
        const trimmed = line.trim();
        // Skip comments and empty lines
        if (!trimmed || trimmed.startsWith('#')) {
          continue;
        }

        const equalIndex = trimmed.indexOf('=');
        if (equalIndex > 0) {
          const key = trimmed.substring(0, equalIndex).trim();
          const value = trimmed.substring(equalIndex + 1).trim();
          config[key] = value;
        }
      }
    }

    return config;
  }

  get(key: string, defaultValue?: string): string {
    return this.config[key] || defaultValue || '';
  }

  getNumber(key: string, defaultValue?: number): number {
    const value = this.config[key];
    if (value) {
      const num = parseInt(value, 10);
      return isNaN(num) ? (defaultValue || 0) : num;
    }
    return defaultValue || 0;
  }

  getBoolean(key: string, defaultValue: boolean = false): boolean {
    const value = this.config[key]?.toLowerCase();
    if (value === 'true' || value === '1' || value === 'yes') {
      return true;
    }
    if (value === 'false' || value === '0' || value === 'no') {
      return false;
    }
    return defaultValue;
  }

  // AI 相关配置
  get aiProvider(): string {
    return this.get('AI_PROVIDER', 'siliconflow');
  }

  get siliconflowApiKey(): string {
    return this.get('SILICONFLOW_API_KEY', '');
  }

  get siliconflowBaseUrl(): string {
    return this.get('SILICONFLOW_BASE_URL', 'https://api.siliconflow.cn/v1');
  }

  get siliconflowModel(): string {
    return this.get('SILICONFLOW_MODEL', 'Qwen/Qwen2.5-7B-Instruct');
  }

  get openaiApiKey(): string {
    return this.get('OPENAI_API_KEY', '');
  }

  get openaiBaseUrl(): string {
    return this.get('OPENAI_BASE_URL', 'https://api.openai.com/v1');
  }

  get openaiModel(): string {
    return this.get('OPENAI_MODEL', 'gpt-4o-mini');
  }

  get moonshotApiKey(): string {
    return this.get('MOONSHOT_API_KEY', '');
  }

  get moonshotBaseUrl(): string {
    return this.get('MOONSHOT_BASE_URL', 'https://api.moonshot.cn/v1');
  }

  get moonshotModel(): string {
    return this.get('MOONSHOT_MODEL', 'moonshot-v1-8k');
  }

  get aiRequestTimeout(): number {
    return this.getNumber('AI_REQUEST_TIMEOUT', 60000);
  }

  get aiMaxContentLength(): number {
    return this.getNumber('AI_MAX_CONTENT_LENGTH', 2000);
  }

  // 数据库配置
  get databaseUrl(): string {
    return this.get('DATABASE_URL', '');
  }

  // JWT 配置
  get jwtSecret(): string {
    return this.get('JWT_SECRET', 'zhixiang-ai-secret-key');
  }

  get jwtExpiresIn(): string {
    return this.get('JWT_EXPIRES_IN', '7d');
  }
}
