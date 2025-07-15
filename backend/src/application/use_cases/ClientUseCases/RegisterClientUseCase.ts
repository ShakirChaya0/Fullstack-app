import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { Client } from "../../../domain/entities/Client.js";
import { PasswordHashingService } from '../../services/PasswordHashing.js';
import { SchemaCliente } from "../../../shared/validators/clientZod.js";


export class RegisterClientUseCase {
    constructor(
        private readonly clientRepository = new ClientRepository, 
        private readonly passwordHashingService = new PasswordHashingService()
    ) {}

    public async execute(data: SchemaCliente ) : Promise<Client> {
        const hashedPassword = await this.passwordHashingService.hashPassword(data.contrasenia); 
        const newClientData = {
            ...data,
            contrasenia: hashedPassword,
        };
        

        const newClient = await this.clientRepository.createClient(newClientData);
        console.log(newClient.email);
        console.log(newClient);
        return newClient;
    }
}