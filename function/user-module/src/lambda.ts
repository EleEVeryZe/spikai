import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Context, Handler } from 'aws-lambda';
import { INestApplication } from '@nestjs/common';
import { IDequeueServicePort } from './domain/ports/dequeue-service.port';

let cachedServer: Handler;
let cachedApp: INestApplication;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, apollo-require-preflight, x-apollo-operation-name',
  });
  await app.init();

  cachedApp = app;

  return serverlessExpress({
    app: app.getHttpAdapter().getInstance(),
  });
}

function extractSqsRecords(event: any): any[] | null {
  if (event.Records) return event.Records;

  if (event.body) {
    try {
      const parsedBody = JSON.parse(event.body);
      return parsedBody.Records || null;
    } catch {
      return null;
    }
  }

  return null;
}

function isSqsEvent(records: any[]): boolean {
  return records && records.length > 0 && records[0]?.eventSource === 'aws:sqs';
}

function extractSqsPayload(record: any): any {
  const sqsBody = typeof record.body === 'string' ? JSON.parse(record.body) : record.body;

  if (sqsBody.Type === 'Notification' && sqsBody.Message) {
    return typeof sqsBody.Message === 'string' ? JSON.parse(sqsBody.Message) : sqsBody.Message;
  }

  return sqsBody;
}

async function processSqsMessages(records: any[], aiService: any): Promise<{ statusCode: number; body: string }> {
  for (const record of records) {
    console.log("Processing SQS job", record.body);
    const payload = extractSqsPayload(record);
    await aiService.dequeue(payload.jobId, payload);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Task Processed Successfully' }),
  };
}

function normalizeApiGatewayPath(event: any): void {
  const stage = event.requestContext?.stage;
  if (stage && event.rawPath?.startsWith(`/${stage}`)) {
    event.rawPath = event.rawPath.slice(stage.length + 1) || '/';
  }
}

function isCorsPreflightRequest(event) {
    const method = event.httpMethod || event.requestContext?.http?.method || event.requestContext?.method;
    return method === 'OPTIONS';
}

export const handler: Handler = async (event: any, context: Context) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }

  console.log("Event Received:", JSON.stringify(event));
  if (isCorsPreflightRequest(event)) {
    return;
  }

  const sqsRecords = extractSqsRecords(event);
  if (sqsRecords && isSqsEvent(sqsRecords)) {
    const aiService = cachedApp.get(IDequeueServicePort);
    return await processSqsMessages(sqsRecords, aiService);
  }

  normalizeApiGatewayPath(event);

  return cachedServer(event, context, () => { });
};