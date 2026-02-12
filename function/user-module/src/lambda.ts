import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Context, Handler } from 'aws-lambda';

let cachedServer: Handler;
export const handler: Handler = async (event: any, context: Context) => {
  if (event.rawPath && event.rawPath.startsWith('/default')) {
    event.rawPath = event.rawPath.replace('/default', '');
  }
  
  if (event.requestContext?.http?.path?.startsWith('/default')) {
    event.requestContext.http.path = event.requestContext.http.path.replace('/default', '');
  }

  if (!cachedServer) {
    const nestApp = await NestFactory.create(AppModule);

    nestApp.setGlobalPrefix('userModule'); 
    
    nestApp.enableCors();
    await nestApp.init();
    
    const expressApp = nestApp.getHttpAdapter().getInstance();
    cachedServer = serverlessExpress({ app: expressApp });
  }

  return cachedServer(event, context, () => {}); 
};