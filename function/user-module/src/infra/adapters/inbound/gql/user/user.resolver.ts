import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { LoginInput } from './dto/logininput';
import { LoginUseCase } from '@/application/use-cases/login/login.use-case';
import { AuthResponse } from '@/application/use-cases/login/dto/auth.response';

@Resolver(() => AuthResponse)
export class UserResolver {

  constructor(private readonly loginUseCase: LoginUseCase) { }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.loginUseCase.login(loginInput.email, loginInput.password);
  }  

  @Query(() => String)
  healthCheck() {
    return 'User service is online';
  }
}