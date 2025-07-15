import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { Client } from "../../../domain/entities/Client.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetClientByIdUserName {
    constructor(
        private readonly clientRepository = new ClientRepository
    ){}

    public async execute(usern: string): Promise<Client> {
        const client = await this.clientRepository.getClientByUserName(usern); 
        if(!client) {
            throw new NotFoundError('Cliente no encontrado');
        }
        return client;
    }
}