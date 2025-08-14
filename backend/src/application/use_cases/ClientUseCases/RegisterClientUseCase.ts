import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { Client } from "../../../domain/entities/Client.js";
import { ClientStateRepository } from "../../../infrastructure/database/repository/ClientStateRepository.js";
import { PasswordHashingService } from '../../services/PasswordHashing.js';
import { SchemaCliente } from "../../../shared/validators/ClientZod.js";

export class RegisterClientUseCase {
    constructor(
        private readonly clientRepository = new ClientRepository(), 
        private readonly passwordHashingService = new PasswordHashingService(),
        private readonly clientStateRepository = new ClientStateRepository()
    ) {}

    public async execute(data: SchemaCliente): Promise<Client> {
        const hashedPassword = await this.passwordHashingService.hashPassword(data.contrasenia);
        
        const newClientData = {
            ...data,
            contrasenia: hashedPassword,
        };

        const newClient = await this.clientRepository.createClient(newClientData);

        await this.clientStateRepository.create(newClient.userId, 'Habilitado'); 
        
        return newClient;
    }
}
