import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Context, Handler } from 'aws-lambda';
import { AiMessageQueue } from './infra/adapters/outbound/queue/sqs/AiMessageQueue';
import { IMessageQueue } from './domain/ports/message.queue.port';

let cachedServer: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.init();

  return serverlessExpress({
    app: app.getHttpAdapter().getInstance(),
  });
}

//TODO: REDUCE COMPLEXITY OF FUNCTION
export const handler: Handler = async (event: any, context: Context) => {
  if (!cachedServer) {
    cachedServer = await bootstrap();
  }

  if (event.Records && event.Records[0].eventSource === 'aws:sqs') {
    const app = await NestFactory.createApplicationContext(AppModule);
    const aiService = app.get(IMessageQueue); 

    for (const record of event.Records)
      await aiService.processAiTask(JSON.parse(record.body)); 
    
    return cachedServer;
  } 

  const stage = event.requestContext?.stage;

  if (stage && event.rawPath?.startsWith(`/${stage}`)) {
    event.rawPath = event.rawPath.slice(stage.length + 1) || '/';
  }

  if (stage && event.requestContext?.http?.path?.startsWith(`/${stage}`)) {
    event.requestContext.http.path =
      event.requestContext.http.path.slice(stage.length + 1) || '/';
  }

  return cachedServer(event, context, () => { });
};