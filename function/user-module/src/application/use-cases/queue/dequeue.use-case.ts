import { QueueStatus } from "@/domain/entity/queue-status.model";
import { IDequeueServicePort } from "@/domain/ports/dequeue-service.port";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class DequeueUseCase {
    constructor(@Inject(IDequeueServicePort) private readonly dequeueMessage: IDequeueServicePort ) { }

    execute(jobId: string, body: any) : Promise<QueueStatus> {
       return this.dequeueMessage.dequeue(jobId, body); 
    }
}