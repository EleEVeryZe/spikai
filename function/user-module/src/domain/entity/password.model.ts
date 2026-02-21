import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
export class Password {

    constructor(private readonly password: string){}

    getValue() {
        return this.password;
    }

    hashPassword(password: string) {
        const salt = randomBytes(16).toString('hex');
        const hash = scryptSync(password, salt, 64).toString('hex');
        return `${salt}:${hash}`;
    }

    verifyPassword(password: string) {
        const [salt, key] = password.split(':');
        const hash = scryptSync(this.password, salt, 64);
        const keyBuffer = Buffer.from(key, 'hex');
        return timingSafeEqual(hash, keyBuffer);
    }
}