import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../persistence/rodsDb/user.service";
import { IUser } from "../persistence/interfaces/user.service";

@Injectable()
export class AuthService {
    constructor(@Inject("IUser") private readonly userService: IUser ) { }

    async login(email: string, pass: string) {
        const user = await this.userService.getUserByEmail(email);
        const isMatch = await user.hashedPassword.verifyPassword(pass);

        if (!isMatch) throw new UnauthorizedException('Credenciais inválidas');

        return {
            access_token: await user.encodePayload()
        };
    }
}