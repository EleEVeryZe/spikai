import { UserDomain } from "src/domain/entity/user.model";
import { UserInfra } from "../entities/user.entity";

export abstract class IUser {
    abstract getUserByEmail(email: string): Promise<UserDomain>;
}
