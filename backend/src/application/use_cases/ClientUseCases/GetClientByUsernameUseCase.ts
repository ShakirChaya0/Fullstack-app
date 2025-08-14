import { Client } from "../../../domain/entities/Client.js";
import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetClientByUserNameUseCase {
    constructor (
        private readonly clientRepository = new ClientRepository
    ) {}

    public async execute(username: string): Promise<Client> {
        const client  =  await this.clientRepository.getClientByUsername(username);
        if(!client) {
            throw new NotFoundError('Cliente no encontrado');
        }
        return client;
    }
}