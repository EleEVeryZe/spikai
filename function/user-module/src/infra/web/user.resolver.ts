import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { User } from '../dto/user';

@Resolver(() => User)
export class UserResolver {
  
  @Query(() => User) 
  async getUser(@Args('id', { type: () => Int }) id: number) {
    return { id, username: 'dev_user', blabla: "blabla" }; 
  }
}