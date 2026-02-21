import { UserDomain } from "src/domain/entity/user.model";
import { UserInfra } from "../entities/user.entity";
import { IUser } from "../interfaces/user.service";
import { Password } from "src/domain/entity/password.model";

export class UserService implements IUser {
    getUserByEmail(email: string): UserDomain {
        const usrMocked: UserInfra = {
            id: 1,
            email: "fake@fake.com",
            username: "fake",
            passwordHash: ""
        }
        const domainUser = new UserDomain();
        domainUser.id = usrMocked.id;
        domainUser.email = usrMocked.email;
        domainUser.username = usrMocked.username;
        domainUser.hashedPassword = new Password(usrMocked.passwordHash);
            
        return domainUser;
    }

}