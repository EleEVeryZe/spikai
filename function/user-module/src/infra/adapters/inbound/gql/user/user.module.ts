import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserService } from "../../../outbound/persistence/rodsDb/user.service";
import { LoginUseCase } from "../../../../../application/use-cases/login/login.use-case";

@Module({
  providers: [
    UserResolver, 
    LoginUseCase,
    UserService,
    {
      provide: 'UserRepository',
      useClass: UserService
    }
  ],

})
export class UserModule {}