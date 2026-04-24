import { QueueStatus } from "@/domain/entity/queue-status.model";
import { IEnqueueServicePort } from "@/domain/ports/enqueue-service.port";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class EnqueueUseCase {
    constructor(@Inject(IEnqueueServicePort) private readonly enqueueMessage: IEnqueueServicePort ) { }

    execute(body: any) : Promise<QueueStatus> {
       return this.enqueueMessage.enqueue(body); 
    }
}