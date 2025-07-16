import { PrismaClient } from "@prisma/client/extension";
import { Reserve } from "../../../domain/entities/Reserve.js";
import { SchemaReserve } from "../../../domain/schemas/SchemaReserve.js";
import { IReserveRepository } from "../../infrastructure/database/repository/IReserveRepository.js";


const prisma = new PrismaClient();

export class ReserveRepository implements IReserveRepository {
    async createReserve(,reserve: SchemaReserve): Promise<Reserve> {
        const createdReserve = await prisma.reserve.create({
            data: {
                fechaCancelacion: reserve.fechaCancelacion,
                fechaReserva: reserve.fechaReserva,
                horaReserva: reserve.horaReserva,
                estadoReserva: reserve.estadoReserva,
                clienteId: reserve.clienteId,
            }
        });
        return new Reserve(createdReserve);
    }

    async getReserveById(id: string): Promise<Reserve | null> {
        const reserve = await prisma.reserve.findUnique({
            where: { id },
        });
        return reserve ? new Reserve(reserve) : null;
    }

    async getReservesByClientCompleteName(name: string, lastName: string): Promise<Reserve[]> {
        const reserves = await prisma.reserve.findMany({
            where: {
                clientName: name,
                clientLastName: lastName,
            },
        });
        return reserves.map((reserve) => new Reserve(reserve));
    }

    async getReservesToday(): Promise<Reserve[]> {
        const reserves = await prisma.reserve.findMany();
        return reserves.map((reserve) => new Reserve(reserve));
    }

    async updateReserve(id: string, reserve: SchemaReserve): Promise<Reserve | null> {
        const updatedReserve = await prisma.reserve.update({
            where: { id },
            data: reserve,
        });
        return updatedReserve ? new Reserve(updatedReserve) : null;
    }
}
