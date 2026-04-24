import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserService } from "../../../outbound/persistence/typeorm/user.service";
import { LoginUseCase } from "@/application/use-cases/login/login.use-case";
import { CreateUserUseCase } from "@/application/use-cases/user/create-user.use-case";
import { UpdateUserUseCase } from "@/application/use-cases/user/update-user.use-case";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@/infra/adapters/outbound/persistence/typeorm/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserResolver, 
    LoginUseCase,
    CreateUserUseCase,
    UpdateUserUseCase,
    {
      provide: 'UserRepository',
      useClass: UserService
    }
  ],
  exports: ['UserRepository']
})
export class UserModule {}