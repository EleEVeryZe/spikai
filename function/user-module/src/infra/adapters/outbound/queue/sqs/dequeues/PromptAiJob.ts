import { Inject, Injectable } from "@nestjs/common";
import { QueueStatus } from "@/domain/entity/queue-status.model";
import { IDequeueServicePort } from "@/domain/ports/dequeue-service.port";
import { AiServicePort } from "@/domain/ports/ai-service.port";

@Injectable()
export class PromptAiJob extends IDequeueServicePort {
    constructor(@Inject(AiServicePort)
        private readonly aiServicePort: AiServicePort){
            super();
    }

    protected async execute(jobId: string, body: any): Promise<QueueStatus> {
        await this.aiServicePort.generateResponse(body.prompt);
        return {
            jobId,
            status: "Finished",
            message: "Done!" 
        }
    }
}