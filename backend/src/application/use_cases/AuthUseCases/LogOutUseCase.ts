import { RefreshTokenRepository } from "../../../infrastructure/database/repository/RefreshTokenRepository.js";


export class LogOutUseCase {
    constructor(
        private readonly refreshTokenRepository = new RefreshTokenRepository()
    ){}
    async execute(token: string): Promise<void> {
        await this.refreshTokenRepository.revokeToken(token);
    }
}