import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { UnauthorizedError } from "../../../shared/exceptions/UnauthorizedError.js";
import { JWTService } from "../../services/JWTService.js";

export class VerifyEmailUseCase {
    constructor(
        private readonly clientRepository = new ClientRepository(),
        private readonly jwtService = new JWTService(),
    ){}

    async execute(token: string): Promise<void> {
        let payload: { userId: string } | string;

        try {
            payload = this.jwtService.verifyConfirmEmailToken(token);
        } catch (err) {
            throw new UnauthorizedError("Token inválido o expirado");
        }
        if (typeof payload === 'string') throw new UnauthorizedError("Token inválido o expirado");

        const client = await this.clientRepository.getClientByidUser(payload.userId);
        if (!client) throw new NotFoundError("No existe un cliente con el id recibido");

        if (client.emailVerified) throw new ConflictError("El correo ya fue verificado");

        await this.clientRepository.verifyClientEmail(client.userId);
    }
}