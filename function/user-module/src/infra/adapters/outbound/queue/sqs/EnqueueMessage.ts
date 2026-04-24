import { IEnqueueServicePort } from "@/domain/ports/enqueue-service.port";
import { getSsmSecret } from "@/application/utils/ssm";
import { Injectable, Logger } from "@nestjs/common";
import { QueueStatus } from "@/domain/entity/queue-status.model";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({});

@Injectable()
export class EnqueueMessage implements IEnqueueServicePort {
    private readonly logger = new Logger(EnqueueMessage.name);

    async enqueue(usrPromt: string): Promise<QueueStatus> {
        const jobId = crypto.randomUUID();
        this.logger.log(`Publishing to SNS Topic for Job: ${jobId}`);

        const snsTopicArn = await getSsmSecret("/spkai/sns/topic-arn");

        const params = {
            TopicArn: snsTopicArn,
            Message: JSON.stringify({ jobId, data: usrPromt }),
            Subject: `AI Processing Job: ${jobId}`
        };

        await sns.send(new PublishCommand(params));

        return {
            jobId,
            status: "Processing",
            message: "Task Broadcasted via SNS. Multiple services may process this."
        }
    }
}