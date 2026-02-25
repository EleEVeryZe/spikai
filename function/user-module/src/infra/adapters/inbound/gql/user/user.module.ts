import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserService } from "../../../outbound/persistence/rodsDb/user.service";
import { LoginUseCase } from "../../../../../application/use-cases/login/login.use-case";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "@/infra/adapters/outbound/persistence/rodsDb/entities/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserResolver, 
    LoginUseCase,
    {
      provide: 'UserRepository',
      useClass: UserService
    }
  ],
  exports: ['UserRepository']
})
export class UserModule {}