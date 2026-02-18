import { RefreshTokenInterface } from "../interfaces/RefreshTokenInterface.js";

export interface IRefreshTokenRepository {
    saveRefreshedToken(userId: string, refreshToken: string, endDate: Date): Promise<void>;
    revokeToken(token: string): Promise<void>;
    getRefreshToken(token: string): Promise<RefreshTokenInterface | null>;
}