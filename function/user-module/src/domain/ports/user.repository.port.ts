import { UserDomain } from "src/domain/entity/user.model";

export abstract class UserRepository {
    abstract getUserByEmail(email: string): Promise<UserDomain | null>;
}
