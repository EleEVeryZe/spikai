import { UserDomain } from "src/domain/entity/user.model";

export abstract class UserRepository {
    abstract getUserByEmail(email: string): Promise<UserDomain | null>;
    abstract getUserById(id: number): Promise<UserDomain | null>;
    abstract create(user: UserDomain): Promise<UserDomain>;
    abstract update(user: UserDomain): Promise<UserDomain>;
}
