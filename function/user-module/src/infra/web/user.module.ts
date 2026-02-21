import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { IUser } from "./persistence/interfaces/user.service";
import { UserService } from "./persistence/rodsDb/user.service";

@Module({
  providers: [
    UserResolver, 
    UserService,
    {
      provide: IUser,
      useClass: UserService
    }
  ],

})
export class UserModule {}