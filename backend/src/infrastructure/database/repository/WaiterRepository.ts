import { PrismaClient } from "@prisma/client";
import { Waiter } from "../../../domain/entities/Waiter.js";
import { IWaiterRepository } from "../../../domain/repositories/IWaiterRepository.js";
import { SchemaWaiter ,PartialSchemaWaiter } from "../../../shared/validators/waiterZod.js";

const prisma = new PrismaClient();

export class WaiterRepository implements IWaiterRepository {
    public async createWaiter(data: SchemaWaiter): Promise<Waiter> {
        const newWaiter = await prisma.mozo.create({
            data: {
                ...data
            }
        });
        return new Waiter(
            newWaiter.idMozo,
            newWaiter.nombreUsuario,
            newWaiter.contrasenia,
            newWaiter.nombre,
            newWaiter.apellido,
            newWaiter.DNI,
            newWaiter.telefono,
            newWaiter.email
        );
    }

    public async deleteWaiter(idMozo: number): Promise<{message: string}> {
        const deletedWaiter = await prisma.mozo.delete({
            where: { idMozo: idMozo }
        });
        if (!deletedWaiter) {
            throw new Error(`No se pudo eliminar el Mozo con el id: ${idMozo}`);
        }
        return { message: `Mozo con id ${idMozo} eliminado correctamente` };
    }

    public async getAllWaiters(): Promise<Waiter[]> {
        const waiters = await prisma.mozo.findMany();
        return waiters.map(waiter => new Waiter(
            waiter.idMozo,
            waiter.nombreUsuario,
            waiter.contrasenia,
            waiter.nombre,
            waiter.apellido,
            waiter.DNI,
            waiter.telefono,
            waiter.email
        ));
    }

    public async getWaiterByUserName(userName: string): Promise<Waiter | null> {
        const waiter = await prisma.mozo.findUnique({
            where: { nombreUsuario: userName }
        }); 
        if (!waiter) {
            throw new Error(`No se encontro un Mozo con el nombre de usuario: ${userName}`);
        }
        return new Waiter(
            waiter.idMozo,
            waiter.nombreUsuario,
            waiter.contrasenia,
            waiter.nombre,
            waiter.apellido,
            waiter.DNI,
            waiter.telefono,
            waiter.email
        );
    }

    
    public async updateWaiter(idMozo: number, data: PartialSchemaWaiter): Promise<Waiter> {
        const updatedWaiter = await prisma.mozo.update({
            where: { idMozo: idMozo },
            data: {
                ...data
            }
        });
        return new Waiter(
            updatedWaiter.idMozo,
            updatedWaiter.nombreUsuario,
            updatedWaiter.contrasenia,
            updatedWaiter.nombre,
            updatedWaiter.apellido,
            updatedWaiter.DNI,
            updatedWaiter.telefono,
            updatedWaiter.email
        );
    }

    public async getWaiterById(idMozo: number): Promise<Waiter> {
        const waiter = await prisma.mozo.findUnique({
            where: { idMozo: idMozo }
        });
        if (!waiter) {
            throw new Error(`No se encontro un Mozo con el id: ${idMozo}`);
        }
        return new Waiter(
            waiter.idMozo,
            waiter.nombreUsuario,
            waiter.contrasenia,
            waiter.nombre,
            waiter.apellido,
            waiter.DNI,
            waiter.telefono,
            waiter.email
        );
    }
}