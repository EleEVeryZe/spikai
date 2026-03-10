import { Logger } from "@nestjs/common";
import { QueueStatus } from "../entity/queue-status.model";

export abstract class IDequeueServicePort {
  private readonly logger = new Logger(IDequeueServicePort.name);

  protected abstract execute(jobId: string, body: any): Promise<QueueStatus>;
  async dequeue(jobId: string, body: any): Promise<QueueStatus> {
       this.logger.log(`Starting AI task for Job: ${jobId}`);

        try {
            const result = await this.execute(jobId, body);

            await this.saveResult(jobId, result);

            this.logger.log(`Finished Job: ${jobId}`);
        } catch (error) {
            this.logger.error(`Failed Job: ${jobId}`, error.stack);
            throw error;
        }
        throw new Error("Method not implemented."); 
  }

  private async saveResult(jobId: string, body: any) {
    console.log("Function Not Implemented Yet!!!") // TODO: implement this function
  }

}
