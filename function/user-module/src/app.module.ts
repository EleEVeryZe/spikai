import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './infra/adapters/inbound/gql/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getSsmSecret } from './application/utils/ssm';
import { AIModule } from './infra/adapters/inbound/gql/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          type: 'postgres', 
          url: await getSsmSecret("/spkai/db/supabase"),
          autoLoadEntities: true,
          synchronize: false, 
        };
      },
    }),
    UserModule,
    AIModule, //TODO: Refactor this part so when a queue is starting the app, only loads the specific of what It needs
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
