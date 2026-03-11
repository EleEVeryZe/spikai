import { Resolver, Query, Args, Int, Mutation } from '@nestjs/graphql';
import { LoginInput } from './dto/logininput';
import { CreateUserInput } from './dto/createuserinput';
import { UpdateUserInput } from './dto/updateuserinput';
import { LoginUseCase } from '@/application/use-cases/login/login.use-case';
import { CreateUserUseCase } from '@/application/use-cases/user/create-user.use-case';
import { UpdateUserUseCase } from '@/application/use-cases/user/update-user.use-case';
import { AuthResponse } from '@/application/use-cases/login/dto/auth.response';
import { UserResponse } from '@/application/use-cases/user/dto/user.response';

@Resolver()
export class UserResolver {

  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase
  ) { }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this.loginUseCase.execute(loginInput.email, loginInput.password);
  }

  @Mutation(() => UserResponse)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.createUserUseCase.execute(
      createUserInput.email,
      createUserInput.username,
      createUserInput.password
    );
  }

  @Mutation(() => UserResponse)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.updateUserUseCase.execute(
      updateUserInput.id,
      updateUserInput.email,
      updateUserInput.username,
      updateUserInput.password
    );
  }

  @Query(() => String)
  healthCheck() {
    return 'User service is online';
  }
}