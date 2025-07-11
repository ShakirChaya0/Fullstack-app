import { PrismaClient } from "@prisma/client";
import { Waiter } from "../../../domain/entities/Waiter.js";
import { IWaiterRepository } from "../../../domain/repositories/IWaiterRepository.js";
import { SchemaWaiter ,PartialSchemaWaiter } from "../../../shared/validators/waiterZod.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

const prisma = new PrismaClient();

export class WaiterRepository implements IWaiterRepository {
    public async createWaiter(data: SchemaWaiter): Promise<Waiter> {
        try {
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
        catch (error: any) {
            if (error?.code === 'P2002' && error?.meta?.target?.includes('nombreUsuario')) {
                throw new ConflictError("Ya existe un Mozo con ese nombre de usuario");
            } else {
                throw new ServiceError(`Error al crear el Mozo: ${error.message}`);
            }
        }
    }

    public async deleteWaiter(idMozo: string): Promise<{ message: string }> {
        const deletedWaiter = await prisma.mozo.delete({
            where: { idMozo: idMozo }
        });
        if (!deletedWaiter) {
            throw new NotFoundError("Mozo no encontrado");
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

    public async getWaiterByUserName(userName: string): Promise<Waiter> {
        const waiter = await prisma.mozo.findUnique({
            where: { nombreUsuario: userName }
        }); 
        if (!waiter) {
            throw new NotFoundError(`No se encontro un Mozo con el nombre de usuario: ${userName}`);
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

    
    public async updateWaiter(idMozo: string, data: PartialSchemaWaiter): Promise<Waiter> {
        // console.log("Updating waiter with id:", data);
        const updatedWaiter = await prisma.mozo.update({
            where: { idMozo: idMozo },
            data: {
                ...data
            }
        });
        // console <-- ????????
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

    public async getWaiterById(idMozo: string): Promise<Waiter> {
        const waiter = await prisma.mozo.findUnique({
            where: { idMozo: idMozo }
        });
        if (!waiter) {
            throw new NotFoundError(`No se encontro un Mozo con el id: ${idMozo}`);
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