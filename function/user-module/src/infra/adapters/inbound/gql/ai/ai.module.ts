import { Module } from "@nestjs/common";
import { AIResolver } from "./ai.resolver";
import { EnqueueUseCase } from "@/application/use-cases/queue/enqueue.use-case";
import { EnqueueMessage } from "@/infra/adapters/outbound/queue/sqs/EnqueueMessage";
import { IEnqueueServicePort } from "@/domain/ports/enqueue-service.port";

@Module({
  providers: [
    AIResolver, 
    EnqueueUseCase,
    {
      provide: IEnqueueServicePort,
      useClass: EnqueueMessage 
    }
  ],
  exports: [IEnqueueServicePort]
})
export class AIModule {}