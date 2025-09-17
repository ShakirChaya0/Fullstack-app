import { User } from "../entities/User.js";

export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    updatePassword(userId : string, passwordHash: string): Promise<void>;
}