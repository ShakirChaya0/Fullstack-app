import { PartialClientSchema, SchemaCliente } from "../../shared/validators/ClientZod.js";
import { Client } from "../entities/Client.js";
import { ClientPublicInfo } from "../interfaces/ClientPublicInfo.js";


export interface IClienteRepository {
    getAllClient() : Promise<Client[]>; 
    getClientByidUser (id: string): Promise <Client | null>;
    createClient (data:SchemaCliente) :Promise <Client>;
    updateClient(id: string, data: PartialClientSchema): Promise<Client>;
    verifyClientEmail(clientId: string): Promise<void>;
    unverifyClientEmail(clientId: string): Promise<void>;
    getClientByOtherDatas(clientPublicInfo: ClientPublicInfo) : Promise<Client | null>;
}