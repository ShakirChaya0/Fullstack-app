import { PartialClientSchema, SchemaCliente } from "../../shared/validators/ClientZod.js";
import { Client } from "../entities/Client.js";
import { ClientPublicInfo } from "./IClientPublicInfo.js";


export interface IClienteRepository {
    getAllClient() : Promise<Client[]>; 
    getClientByidUser (id: string): Promise <Client | null>;
    getClientByNameAndLastname(name: string, lastname: string) : Promise<Client | null>;
    createClient (data:SchemaCliente) :Promise <Client>;
    updateClient(id: string, data: PartialClientSchema): Promise<Client>;
    getClientByOtherDatas(clientPublicInfo: ClientPublicInfo) : Promise<Client | null>;
}