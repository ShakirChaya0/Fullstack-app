import { Client } from "../../../domain/entities/Client.js";
import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetClientByIdUser {
    constructor (
        private readonly clientRepository = new ClientRepository
    ) {}

    public async execute(id:string):Promise<Client> {
        const client  =  await this.clientRepository.getClientByidUser(id);
        if(!client) {
            throw new NotFoundError('Cliente no encontrado');
        }
        return client;
    }
}