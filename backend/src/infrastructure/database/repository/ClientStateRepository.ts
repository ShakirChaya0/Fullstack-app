import prisma from "../prisma/PrismaClientConnection.js"
import { stateClient } from "../../../domain/entities/ClientState.js";
import { IClientStateRepository } from "../../../domain/repositories/IClientStateRepository.js";

export class ClientStateRepository implements IClientStateRepository {

    public async create(idCliente: string, stateCliente:stateClient): Promise<void> {
            await prisma.estadosCliente.create({
                data: {
                    idCliente: idCliente,
                    fechaActualizacion: new Date(),
                    estado: stateCliente
                }
            })
    }



}
