import { IUserDomain, UserDomain } from "../../../../../domain/entity/user.model";
import { Password } from "../../../../../domain/entity/password.model";
import { UserRepository } from "../../../../../domain/ports/user.repository.port";

export class UserService implements UserRepository {
    getUserByEmail(email: string): Promise<UserDomain> {
        const user = new UserDomain();
        user.id = 1;
        user.email = 'dev@spikai.com';
        user.username = 'admin';
        user.hashedPassword = new Password("testingPassword:");
        return new Promise(res => res(user));
    }

}