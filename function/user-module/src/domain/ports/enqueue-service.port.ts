import { QueueStatus } from "../entity/queue-status.model";

export abstract class IEnqueueServicePort {
   abstract enqueue(body: any): Promise<QueueStatus>;
}
       