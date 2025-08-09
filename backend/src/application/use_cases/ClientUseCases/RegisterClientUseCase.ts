import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { Client } from "../../../domain/entities/Client.js";
import { ClientStateRepository } from "../../../infrastructure/database/repository/ClientStateRepository.js";
import { PasswordHashingService } from '../../services/PasswordHashing.js';
import { SchemaCliente } from "../../../shared/validators/clientZod.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { Prisma } from "@prisma/client";


export class RegisterClientUseCase {
    constructor(
        private readonly clientRepository = new ClientRepository(), 
        private readonly passwordHashingService = new PasswordHashingService(),
        private readonly clientStateRepository = new ClientStateRepository()
    ) {}

    public async execute(data: SchemaCliente): Promise<Client> {
        try {
            const hashedPassword = await this.passwordHashingService.hashPassword(data.contrasenia);

            const newClientData = {
                ...data,
                contrasenia: hashedPassword,
            };

            const newClient = await this.clientRepository.createClient(newClientData);

            await this.clientStateRepository.create(newClient.userId, 'Habilitado'); 

            return newClient;

        //Ver como solucionar este catch
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    const fields = (error.meta?.target ?? []) as string[];

                    if (fields.includes('nombreUsuario')) {
                        throw new ConflictError("Ya existe un Cliente con ese nombre de usuario");
                    }

                    if (fields.includes('email')) {
                        throw new ConflictError("Ya existe un Cliente con ese email");
                    }
                }

                throw new ServiceError(`Error al registrar el Cliente: ${error.message}`);
            }

            if (error instanceof Error) {
                throw new ServiceError(`Error inesperado: ${error.message}`);
            }

            throw new ServiceError("Error desconocido al registrar el Cliente");
        }
    }
}
