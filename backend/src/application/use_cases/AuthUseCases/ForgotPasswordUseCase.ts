import { UserRepository } from "../../../infrastructure/database/repository/UserRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { JWTService } from "../../services/JWTService.js";
import { MailerService } from "../../services/MailerService.js";

export class ForgotPasswordUseCase {
    constructor(
        private readonly userRepository = new UserRepository(),
        private readonly jwtService = new JWTService(),
        private readonly mailerService = new MailerService()
    ){}

    async execute(email: string): Promise<void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) throw new NotFoundError("No existe un usuario registrado con el mail ingresado");

        const token = this.jwtService.generateResetPasswordToken({ userId: user.userId });

        await this.mailerService.sendResetPasswordEmail(user.email, token);
    }
}