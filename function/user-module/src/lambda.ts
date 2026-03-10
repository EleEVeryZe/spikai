import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Context, Handler } from 'aws-lambda';
import { INestApplication } from '@nestjs/common';
import { IDequeueServicePort } from './domain/ports/dequeue-service.port';

let cachedServer: Handler;
let cachedApp: INestApplication;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.init();

  cachedApp = app; 

  return serverlessExpress({
    app: app.getHttpAdapter().getInstance(),
  });
}

export const handler: Handler = async (event: any, context: Context) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }

  console.log("Event Received:", JSON.stringify(event));
  let records = event.Records;

  if (!records && event.body) {
    try {
      const parsedBody = JSON.parse(event.body);
      if (parsedBody.Records) records = parsedBody.Records;
    } catch (e) {
    }
  }

  if (records && records[0]?.eventSource === 'aws:sqs') {
    const aiService = cachedApp.get(IDequeueServicePort);

    for (const record of records) {
      console.log("Entering SQS job", record.body);
      const sqsBody = typeof record.body === 'string' ? JSON.parse(record.body) : record.body;

      let finalPayload;

      if (sqsBody.Type === 'Notification' && sqsBody.Message) {
        finalPayload = typeof sqsBody.Message === 'string' ? JSON.parse(sqsBody.Message) : sqsBody.Message;
      } else {
        finalPayload = sqsBody;
      }

      await aiService.dequeue(finalPayload.jobId, finalPayload);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Task Processed Successfully' }),
    };
  }

  const stage = event.requestContext?.stage;
  if (stage && event.rawPath?.startsWith(`/${stage}`)) {
    event.rawPath = event.rawPath.slice(stage.length + 1) || '/';
  }

  return cachedServer(event, context, () => {});
};