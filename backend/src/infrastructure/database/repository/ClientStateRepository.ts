import { PrismaClient } from "@prisma/client";
import { stateClient } from "../../../domain/entities/ClientState.js";
import { IClientStateRepository } from "../../../domain/repositories/IClientStateRepository.js";


const prisma = new PrismaClient();

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
