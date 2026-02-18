import bcrypt from "bcryptjs";

export class PasswordHashingService {
    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, process.env.SALT_ROUNDS ? +process.env.SALT_ROUNDS : 10);
    }

    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashedPassword);
    }
}