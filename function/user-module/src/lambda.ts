import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Context, Handler } from 'aws-lambda';
import { IMessageQueue } from './domain/ports/message.queue.port';
import { INestApplication } from '@nestjs/common';

let cachedServer: Handler;
let cachedApp: INestApplication;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.init();

  cachedApp = app; // Cache the Nest instance for DI access

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
    console.log("Entering SQS Processing Logic...");
    
    const aiService = cachedApp.get(IMessageQueue);

    for (const record of records) {
      const payload = typeof record.body === 'string' ? JSON.parse(record.body) : record.body;
      await aiService.processAiTask(payload);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'SQS Task Processed Successfully' }),
    };
  }

  const stage = event.requestContext?.stage;
  if (stage && event.rawPath?.startsWith(`/${stage}`)) {
    event.rawPath = event.rawPath.slice(stage.length + 1) || '/';
  }

  return cachedServer(event, context, () => {});
};