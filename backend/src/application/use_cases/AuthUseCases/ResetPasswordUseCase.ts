import { UserRepository } from "../../../infrastructure/database/repository/UserRepository.js";
import { UnauthorizedError } from "../../../shared/exceptions/UnauthorizedError.js";
import { JWTService } from "../../services/JWTService.js";
import { PasswordHashingService } from "../../services/PasswordHashing.js";

export class ResetPasswordUseCase {
    constructor(
        private readonly userRepository = new UserRepository(),
        private readonly jwtService = new JWTService(),
        private readonly hashingService = new PasswordHashingService()
    ){}

    async execute(token: string, newPassword: string): Promise<void> {
        let payload: { userId: string } | string;

        try {
            payload = this.jwtService.verifyResetPasswordToken(token);
        } catch (err) {
            throw new UnauthorizedError("Token inválido o expirado");
        }

        if (typeof payload === 'string') throw new UnauthorizedError("Token inválido o expirado");

        const passwordHash = await this.hashingService.hashPassword(newPassword);
        await this.userRepository.updatePassword(payload.userId, passwordHash);
    }
}