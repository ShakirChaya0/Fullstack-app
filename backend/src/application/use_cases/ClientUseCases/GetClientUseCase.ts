import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { Client } from "../../../domain/entities/Client.js";

export class GetClientUseCase {
    constructor(
        private readonly clientRepository = new ClientRepository
    ){}

    public async execute() : Promise <Client[]> {
        return await this.clientRepository.getAllClient();
    }
}