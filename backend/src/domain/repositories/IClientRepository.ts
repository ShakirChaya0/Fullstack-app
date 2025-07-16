import { Client } from "../entities/Client.js"
import { SchemaCliente, PartialClientSchema } from "../../shared/validators/clientZod.js";

export interface IClientRepository {
    getAllClient() : Promise<Client[]>; 
    getClientByidUser(idClient: string) : Promise <Client | null>;
    getClientByUserName(userName: string) : Promise <Client | null>;
    createClient(data : SchemaCliente) :Promise <Client>; 
    updateClient(idClient: string, data : PartialClientSchema ) : Promise <Client>
}