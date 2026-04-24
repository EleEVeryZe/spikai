import { Inject, Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { UserRepository } from "@/domain/ports/user.repository.port";
import { UserResponse } from "./dto/user.response";
import { Password } from "@/domain/entity/password.model";

@Injectable()
export class UpdateUserUseCase {
    constructor(@Inject("UserRepository") private readonly userRepository: UserRepository) { }

    async execute(
        id: number,
        email?: string,
        username?: string,
        password?: string
    ): Promise<UserResponse> {
        const user = await this.userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (email && email !== user.email) {
            const existingUser = await this.userRepository.getUserByEmail(email);
            if (existingUser) {
                throw new BadRequestException('Email is already taken');
            }
        }

        if (email) user.email = email;
        if (username) user.username = username;
        if (password) {
            const passwordObj = new Password(password);
            const hashedPassword = passwordObj.hashPassword();
            user.hashedPassword = new Password(hashedPassword);
        }

        const updatedUser = await this.userRepository.update(user);

        return {
            id: updatedUser.id,
            email: updatedUser.email,
            username: updatedUser.username
        };
    }
}
