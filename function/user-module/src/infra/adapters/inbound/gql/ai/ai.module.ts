import { Module } from "@nestjs/common";
import { AIResolver } from "./ai.resolver";
import { AIUseCase } from "@/application/use-cases/ai/ai.use-case";
import { AiMessageQueue } from "@/infra/adapters/outbound/queue/sqs/AiMessageQueue";
import { IMessageQueue } from "@/domain/ports/message.queue.port";

@Module({
  providers: [
    AIResolver, 
    AIUseCase,
    {
      provide: IMessageQueue,
      useClass: AiMessageQueue 
    }
  ],
  exports: [IMessageQueue]
})
export class AIModule {}