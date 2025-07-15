import { Prisma, PrismaClient } from "@prisma/client";
import { Client } from "../../../domain/entities/Client.js";
import {UUID} from 'crypto'
import { SchemaCliente, PartialClientSchema } from "../../../shared/validators/clientZod.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";



type ClientWithUsuario = Prisma.ClientesGetPayload<{
    include: { Usuarios: true };
}>;

const prisma = new PrismaClient();


export class ClientRepository {
    public async getAllClient() : Promise<Client[]> {
        const clients = await prisma.clientes.findMany({
            include: {
                Usuarios: true
            }
        }); 
        return clients.map((client) => { return this.toDomainEntity(client) });
    }

    public async getClientByidUser (id: string): Promise <Client | null> {
        const client = await prisma.clientes.findUnique({
            where: {idCliente : id},
            include: {Usuarios:true}
        });

        if(!client) {
            return null; 
        }

        return this.toDomainEntity(client);
    }

    public async getClientByUserName(userName: string) : Promise<Client | null> {
        const clientFound = await prisma.clientes.findFirst({
            where: {
                Usuarios: {nombreUsuario: userName}
            }, 
            include: {Usuarios:true}
        }); 

        if(!clientFound) {
            return null; 
        }
        return this.toDomainEntity(clientFound);
    } 
    
    public async createClient (data:SchemaCliente) :Promise <Client> {
        try {
            const newClient = await prisma.clientes.create({
                data: {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    telefono: data.telefono,
                    fechaNacimiento: data.fechaNacimiento,
                    Usuarios: {
                        create: {
                            nombreUsuario: data.nombreUsuario,
                            email: data.email,
                            contrasenia: data.contrasenia,
                            tipoUsuario: "Cliente"
                        }
                    }
                },
                include: { Usuarios: true }
            });
            return this.toDomainEntity(newClient);
        }
        catch (error: any) {
            if (error?.code === 'P2002' && error?.meta?.target?.includes('nombreUsuario')) {
                throw new ConflictError("Ya existe un Cliente con ese nombre de usuario");
            } else if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
                throw new ConflictError("Ya existe un Cliente con ese email");
            }
            else {
                throw new ServiceError(`Error al crear el Cliente: ${error.message}`);
            }
        }
    }

    public async updateClient(id: string, data: PartialClientSchema): Promise<Client> {
        const updatedClient = await prisma.clientes.update ({
            where: {idCliente : id}, 
            data: {
                ...data
            }, 
            include: { Usuarios:true}
        }); 
        return this.toDomainEntity(updatedClient);
    }

        private toDomainEntity(client: ClientWithUsuario): Client {
        return new Client(
            client.Usuarios.idUsuario as UUID,
            client.Usuarios.nombreUsuario,
            client.Usuarios.email,
            client.Usuarios.contrasenia,
            client.Usuarios.tipoUsuario,
            client.nombre,
            client.apellido,
            client.telefono, 
            client.fechaNacimiento
        );  
    }

}