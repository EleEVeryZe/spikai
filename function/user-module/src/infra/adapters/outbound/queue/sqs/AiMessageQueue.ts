import { IMessageQueue } from "@/domain/ports/message.queue.port";
import { getSsmSecret } from "@/application/utils/ssm";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Injectable, Logger } from "@nestjs/common";

const sqs = new SQSClient({});

@Injectable()
export class AiMessageQueue implements IMessageQueue {
    private readonly logger = new Logger(AiMessageQueue.name);

    async producePrompt(usrPromt: string): Promise<string> {
        const jobId = crypto.randomUUID();
        const sqsQueueUrl = await getSsmSecret("/spkai/sqs/url");
        const params = {
            QueueUrl: sqsQueueUrl,
            MessageBody: JSON.stringify({ jobId, data: usrPromt }),
        };

        await sqs.send(new SendMessageCommand(params));

        return "TODO: REMOVER STRING RETURN"; //TODO: REMOVER RETORNO DE STRING E SETTAR COMO VOID
    }


    async processAiTask(payload: { jobId: string; prompt: string }) {
        this.logger.log(`Starting AI task for Job: ${payload.jobId}`);

        try {
            const result = await this.callExternalAiApi(payload.prompt);

            await this.saveResult(payload.jobId, result);

            this.logger.log(`Finished Job: ${payload.jobId}`);
        } catch (error) {
            this.logger.error(`Failed Job: ${payload.jobId}`, error.stack);
            throw error;
        }
    }

    private async callExternalAiApi(prompt: string) {
        return { response: "AI generated content..." };
    }

    private async saveResult(jobId: string, result: any) {
    
    }

}