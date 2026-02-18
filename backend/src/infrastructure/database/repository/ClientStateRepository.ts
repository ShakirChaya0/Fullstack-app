import prisma from "../prisma/PrismaClientConnection.js"
import { IClientStateRepository } from "../../../domain/repositories/IClientStateRepository.js";
import { stateClient } from "../../../shared/types/SharedTypes.js";

export class ClientStateRepository implements IClientStateRepository {

    public async create(idCliente: string, stateCliente: stateClient): Promise<void> {
        await prisma.estadosCliente.create({
            data: {
                idCliente: idCliente,
                fechaActualizacion: new Date(),
                estado: stateCliente
            }
        })
    }
}