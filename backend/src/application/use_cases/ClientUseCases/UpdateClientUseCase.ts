import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { Client } from "../../../domain/entities/Client.js";
import { PasswordHashingService } from '../../services/PasswordHashing.js';
import { PartialClientSchema } from "../../../shared/validators/ClientZod.js";
import { NotFoundError } from '../../../shared/exceptions/NotFoundError.js';
import { MailerService } from "../../services/MailerService.js";
import { JWTService } from "../../services/JWTService.js";

export class UpdateClientUseCase {
    constructor(
        private readonly clientRepository = new ClientRepository(),
        private readonly passwordHashingService = new PasswordHashingService(),
        private readonly mailerService = new MailerService(),
        private readonly jwtService = new JWTService()
    ){}

    public async execute(idCliente: string, data:PartialClientSchema) : Promise<Client> {
        const existingClient = await this.clientRepository.getClientByidUser(idCliente);
        if (!existingClient) {
            throw new NotFoundError("Cliente no encontrado");
        }

        if (data.contrasenia) {
            data.contrasenia = await this.passwordHashingService.hashPassword(data.contrasenia);
        }

        const updatedData = {
            ...existingClient,
            ...data,
        };

        const draft = {
            nombreUsuario: updatedData.nombreUsuario,
            contrasenia: updatedData.contrasenia,
            nombre: updatedData.nombre,
            apellido: updatedData.apellido,
            fechaNacimiento : updatedData.fechaNacimiento,
            telefono: updatedData.telefono,
            email: updatedData.email
        };

        if (data.email && data.email !== existingClient.email) {
            await this.clientRepository.unverifyClientEmail(idCliente);
            
            const token = this.jwtService.generateConfirmEmailToken({ userId: idCliente });
            await this.mailerService.sendVerificationEmail(data.email, token);
        }

        const updateClient = await this.clientRepository.updateClient(idCliente, draft);
        return updateClient;
    }
}
