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

            // 1. Convert the stored hash FIRST to check its length
            const keyBuffer = Buffer.from(storedHashHex, 'hex');

            // 2. Use the length of the stored hash for the new hash
            // keyBuffer.length is usually 64 if you used scrypt with 64 originally
            const generatedHash = scryptSync(plainTextPassword, salt, keyBuffer.length);

            // 3. Now they are guaranteed to have the same byte length
            return timingSafeEqual(generatedHash, keyBuffer);
        } catch (err) {
            console.error("Verification failed:", err.message);
            return false;
        }
    }
}