import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { ClientStateRepository } from "../../../infrastructure/database/repository/ClientStateRepository.js";
import { PasswordHashingService } from '../../services/PasswordHashing.js';
import { SchemaCliente } from "../../../shared/validators/ClientZod.js";
import { MailerService } from "../../services/MailerService.js";
import { JWTService } from "../../services/JWTService.js";

export class RegisterClientUseCase {
    constructor(
        private readonly clientRepository = new ClientRepository(), 
        private readonly passwordHashingService = new PasswordHashingService(),
        private readonly clientStateRepository = new ClientStateRepository(),
        private readonly jwtService = new JWTService(),
        private readonly mailerService = new MailerService()
    ) {}

    public async execute(data: SchemaCliente): Promise<void> {
        const hashedPassword = await this.passwordHashingService.hashPassword(data.contrasenia);
        
        const newClientData = {
            ...data,
            contrasenia: hashedPassword,
        };
        
        const newClient = await this.clientRepository.createClient(newClientData);
        
        await this.clientStateRepository.create(newClient.userId, "Habilitado");
        
        const token = this.jwtService.generateConfirmEmailToken({ userId: newClient.userId });
        
        await this.mailerService.sendVerificationEmail(newClient.email, token);
    }
}
