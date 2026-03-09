import { IEnqueueServicePort } from "@/domain/ports/enqueue-service.port";
import { getSsmSecret } from "@/application/utils/ssm";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Injectable, Logger } from "@nestjs/common";
import { QueueStatus } from "@/domain/entity/queue-status.model";

const sqs = new SQSClient({});

@Injectable()
export class EnqueueMessage implements IEnqueueServicePort {
    private readonly logger = new Logger(EnqueueMessage.name);

    async enqueue(usrPromt: string): Promise<QueueStatus> {
        const jobId = crypto.randomUUID();
        this.logger.log(`Creating SQN Job: ${jobId}`);

        const sqsQueueUrl = await getSsmSecret("/spkai/sqs/url");
        const params = {
            QueueUrl: sqsQueueUrl,
            MessageBody: JSON.stringify({ jobId, data: usrPromt }),
        };

        await sqs.send(new SendMessageCommand(params));

        return {
            jobId,
            status: "Processing",
            message: "Task Queued. Please check status after 15 seconds."
        } 
    }
}