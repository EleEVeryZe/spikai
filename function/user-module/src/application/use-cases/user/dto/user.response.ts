import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserResponse {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  username: string;
}
