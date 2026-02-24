import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto';
export class Password {

    constructor(private readonly password: string) { }

    getValue() {
        return this.password;
    }

    hashPassword(password: string) {
        const salt = randomBytes(16).toString('hex');
        const hash = scryptSync(password, salt, 64).toString('hex');
        return `${salt}:${hash}`;
    }

    verifyPassword(plainTextPassword: string) {
        try {
            if (!this.password || !this.password.includes(':')) return false;
            const [salt, storedHashHex] = this.password.split(':');
            const keyBuffer = Buffer.from(storedHashHex, 'hex');
            const generatedHash = scryptSync(plainTextPassword, salt, keyBuffer.length);
            console.log(generatedHash);
            return timingSafeEqual(generatedHash, keyBuffer);
        } catch (err) {
            console.error("Verification failed:", err.message);
            return false;
        }
    }
}