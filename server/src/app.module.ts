import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ContentModule } from './modules/content/content.module';
import { AiModule } from './modules/ai/ai.module';
import { FeedbackModule } from './modules/feedback/feedback.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    ContentModule,
    AiModule,
    FeedbackModule,
  ],
})
export class AppModule {}
