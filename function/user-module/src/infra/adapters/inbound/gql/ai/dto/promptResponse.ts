import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class PromptResponse {
  @Field()
  jobId: string;

  @Field()
  status: string;

  @Field()
  message: string;
}