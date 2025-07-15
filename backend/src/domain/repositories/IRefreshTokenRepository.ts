export interface IRefreshTokenRepository {
    saveRefreshedToken(userId: string, refreshToken: string, endDate: Date): Promise<void>;
}