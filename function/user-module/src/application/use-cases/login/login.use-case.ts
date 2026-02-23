import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserRepository } from "@/domain/ports/user.repository.port";
import { AuthResponse } from "./dto/auth.response";

@Injectable()
export class LoginUseCase {
    constructor(@Inject("UserRepository") private readonly userService: UserRepository ) { }

    async login(email: string, pass: string) : Promise<AuthResponse> {
        const user = await this.userService.getUserByEmail(email);
        const isMatch = await user.hashedPassword.verifyPassword(pass);

        if (!isMatch) throw new UnauthorizedException('Credenciais inválidas');

        return {
            access_token: await user.encodePayload()
        };
    }
}