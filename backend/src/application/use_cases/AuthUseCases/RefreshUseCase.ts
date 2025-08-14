import { UserRepository } from "../../../infrastructure/database/repository/UserRepository.js";
import { JWTService } from "../../services/JWTService.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { RefreshTokenRepository } from "../../../infrastructure/database/repository/RefreshTokenRepository.js";
import { UnauthorizedError } from "../../../shared/exceptions/UnauthorizedError.js";
import { UserType } from "../../../shared/types/SharedTypes.js";

export class RefreshUseCase {
    constructor(
        private readonly userRepository = new UserRepository(),
        private readonly jwtService = new JWTService(),
        private readonly refreshTokenRepository = new RefreshTokenRepository()
    ) {}

    async execute(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
        try{
            const payload = this.jwtService.verifyRefreshToken(refreshToken);
            
            if (typeof payload === 'string') throw new UnauthorizedError("Token inválido o expirado");

            const user = await this.userRepository.findById(payload.idUsuario);

            if (!user) throw new NotFoundError("Usuario no encontrado");

            await this.refreshTokenRepository.revokeToken(refreshToken);

            const newAccessToken = this.jwtService.generateAccessToken({
                idUsuario: user.userId,
                email: user.email,
                tipoUsuario: user.userType as UserType,
                username: user.userName
            });

            const newRefreshToken = this.jwtService.generateRefreshToken({
                idUsuario: user.userId,
                email: user.email,
                tipoUsuario: user.userType as UserType,
                username: user.userName
            });

            const endDate = new Date(Date.now() + 15 * 60 * 1000); 

            await this.refreshTokenRepository.saveRefreshedToken(user.userId, newRefreshToken, endDate);

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        }
        catch (error) {
            throw new UnauthorizedError("Token inválido o expirado");
        }
    }
}