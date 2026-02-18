import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { JWTService } from "../../services/JWTService.js";
import { MailerService } from "../../services/MailerService.js";

export class ResendEmailUseCase {
    constructor(
        private readonly clientRepository = new ClientRepository(),
        private readonly jwtService = new JWTService(),
        private readonly mailerService = new MailerService()
    ){}

    async execute(token: string): Promise<void> {
        const payload = this.jwtService.decodeExpiredEmailToken(token);

        const client = await this.clientRepository.getClientByidUser(payload.userId);
        if (!client) throw new NotFoundError("No existe un cliente con el id recibido");

        if (client.emailVerified) throw new ConflictError("El correo ya fue verificado");

        const newToken = this.jwtService.generateConfirmEmailToken({ userId: client.userId });

        await this.mailerService.sendVerificationEmail(client.email, newToken);
    }
}