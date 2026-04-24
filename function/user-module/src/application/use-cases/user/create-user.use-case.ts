import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import { UserRepository } from "@/domain/ports/user.repository.port";
import { UserResponse } from "./dto/user.response";
import { UserDomain } from "@/domain/entity/user.model";
import { Password } from "@/domain/entity/password.model";

@Injectable()
export class CreateUserUseCase {
    constructor(@Inject("UserRepository") private readonly userRepository: UserRepository) { }

    async execute(email: string, username: string, password: string): Promise<UserResponse> {
        const existingUser = await this.userRepository.getUserByEmail(email);
        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        const passwordObj = new Password(password);
        const hashedPassword = passwordObj.hashPassword();

        const userDomain = new UserDomain({
            email,
            username,
            hashedPassword: new Password(hashedPassword)
        });

        const savedUser = await this.userRepository.create(userDomain);

        return {
            id: savedUser.id,
            email: savedUser.email,
            username: savedUser.username
        };
    }
}
