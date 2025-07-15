import { PrismaClient } from "@prisma/client";
import { UUID } from 'crypto'
import { ClientState } from "../../../domain/entities/ClientState.js";
import { IClientStateRepository } from "../../../domain/repositories/IClientStateRepository.js";
import { SchemaClientState } from "../../../shared/validators/clienteStateZod.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";

const prisma = new PrismaClient();

export class ClientStateRepository implements IClientStateRepository {

    public async create(clienteState: SchemaClientState, idCliente: UUID): Promise<ClientState> {
        try{
            const state = await prisma.estadosCliente.create({
                data: {
                    ...clienteState,
                    idCliente
                }
            })
            return new ClientState(
                state.fechaActualizacion,
                state.estado
            )
        }catch( error: any){
            throw new ServiceError(`Error al crear el Mozo: ${error.message}`);
        }
    }

}
