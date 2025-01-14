import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [AiService],
  controllers: [AiController],
})
export class AiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    console.log('init character module');
  }
}
