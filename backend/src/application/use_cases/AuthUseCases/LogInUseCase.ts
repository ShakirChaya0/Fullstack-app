import { TipoUsuario_Type } from "@prisma/client";
import { UserRepository } from "../../../infrastructure/database/repository/UserRepository.js";
import { UnauthorizedError } from "../../../shared/exceptions/UnauthorizedError.js";
import { JWTService } from "../../services/JWTService.js";
import { PasswordHashingService } from "../../services/PasswordHashing.js";
import { UUID } from "crypto";
import { RefreshTokenRepository } from "../../../infrastructure/database/repository/RefreshTokenRepository.js";

export class LoginUseCase{
    constructor(
        private readonly jwtService = new JWTService(),
        private readonly userRepository = new UserRepository(),
        private readonly hashService = new PasswordHashingService(),
        private readonly refreshTokenRepository = new RefreshTokenRepository() 
    ){}
    async execute(email: string, password: string): Promise<{accessToken: string, refreshToken: string}> {
        const user = await this.userRepository.findByEmail(email)

        if(!user) throw new UnauthorizedError("Email o contraseña incorrectos")

        const isPasswordValid = await this.hashService.comparePasswords(password, user.password)

        if(!isPasswordValid) throw new UnauthorizedError("Email o contraseña incorrectos")

        const payload = {
            idUsuario: user.userId as UUID,
            email: user.email,
            tipoUsuario: user.userType as TipoUsuario_Type
        }

        const accessToken = await this.jwtService.generateAccessToken(payload)
        const refreshToken = await this.jwtService.generateRefreshToken(payload)

        const endDate = new Date(Date.now() + 15 * 60 * 1000);

        await this.refreshTokenRepository.saveRefreshedToken(user.userId, refreshToken, endDate)

        return {accessToken, refreshToken}
    }
}