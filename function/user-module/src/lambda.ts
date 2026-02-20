import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Context, Handler } from 'aws-lambda';

let cachedServer: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.init();

  return serverlessExpress({
    app: app.getHttpAdapter().getInstance(),
  });
}

export const handler: Handler = async (event: any, context: Context) => {
 console.log("EVENT RECEIVED3:", JSON.stringify(event, null, 2));

  if (!cachedServer) {
    cachedServer = await bootstrap();
  }

  const stage = event.requestContext?.stage;

  if (stage && event.rawPath?.startsWith(`/${stage}`)) {
    event.rawPath = event.rawPath.slice(stage.length + 1) || '/';
  }

  if (stage && event.requestContext?.http?.path?.startsWith(`/${stage}`)) {
    event.requestContext.http.path =
      event.requestContext.http.path.slice(stage.length + 1) || '/';
  }

  return cachedServer(event, context, () => {}); 
};