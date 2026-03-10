import { Module } from "@nestjs/common";
import { AIResolver } from "./ai.resolver";
import { EnqueueUseCase } from "@/application/use-cases/queue/enqueue.use-case";
import { EnqueueMessage } from "@/infra/adapters/outbound/queue/sqs/EnqueueMessage";
import { IEnqueueServicePort } from "@/domain/ports/enqueue-service.port";
import { DequeueUseCase } from "@/application/use-cases/queue/dequeue.use-case";
import { IDequeueServicePort } from "@/domain/ports/dequeue-service.port";
import { PromptAiJob } from "@/infra/adapters/outbound/queue/sqs/dequeues/PromptAiJob";
import { AiServicePort } from "@/domain/ports/ai-service.port";
import { DeepSeekAdapter } from "@/infra/adapters/outbound/ai/DeepSeekAdapter";

@Module({
  providers: [
    AIResolver, 
    {
      provide: AiServicePort,
      useClass: DeepSeekAdapter 
    }
    ,
    DequeueUseCase,
    {
      provide: IDequeueServicePort,
      useClass: PromptAiJob
    },
    EnqueueUseCase,
    {
      provide: IEnqueueServicePort,
      useClass: EnqueueMessage 
    }
  ],
  exports: [IEnqueueServicePort, IDequeueServicePort, AiServicePort]
})
export class AIModule {}