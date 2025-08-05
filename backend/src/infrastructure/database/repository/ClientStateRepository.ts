import { PrismaClient } from "@prisma/client";
import { UUID } from 'crypto'
import { ClientState } from "../../../domain/entities/ClientState.js";
import { IClientStateRepository } from "../../../domain/repositories/IClientStateRepository.js";


const prisma = new PrismaClient();

export class ClientStateRepository implements IClientStateRepository {

    public async create(idCliente: UUID): Promise<ClientState> {
            const state = await prisma.estadosCliente.create({
                data: {
                    idCliente: idCliente as UUID,
                    fechaActualizacion: new Date(),
                    estado: 'Habilitado'
                }
            })
            return new ClientState(
                state.fechaActualizacion,
                state.estado
            )
    }



}
