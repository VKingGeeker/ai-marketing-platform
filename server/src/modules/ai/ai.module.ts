import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { SiliconFlowService } from './services/siliconflow.service';
import { OpenAIService } from './services/openai.service';
import { MoonshotService } from './services/moonshot.service';
import { ContentSafetyService } from './services/content-safety.service';
import { AIProviderManager } from './services/ai-provider-manager.service';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    SiliconFlowService,
    OpenAIService,
    MoonshotService,
    ContentSafetyService,
    AIProviderManager,
  ],
  exports: [AiService, AIProviderManager],
})
export class AiModule {}
