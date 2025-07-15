import { Prisma, PrismaClient } from "@prisma/client";
import { Waiter } from "../../../domain/entities/Waiter.js";
import { IWaiterRepository } from "../../../domain/repositories/IWaiterRepository.js";
import { SchemaWaiter ,PartialSchemaWaiter } from "../../../shared/validators/waiterZod.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { UUID } from "crypto";

const prisma = new PrismaClient();

type MozoWithUsuario = Prisma.MozosGetPayload<{
    include: { Usuarios: true };
}>;

export class WaiterRepository implements IWaiterRepository {
    public async createWaiter(data: SchemaWaiter): Promise<Waiter> {
        try {
            const newWaiter = await prisma.mozos.create({
                data: {
                    nombre: data.nombre,
                    apellido: data.apellido,
                    dni: data.dni,
                    telefono: data.telefono,
                    Usuarios: {
                        create: {
                            nombreUsuario: data.nombreUsuario,
                            email: data.email,
                            contrasenia: data.contrasenia,
                            tipoUsuario: "Mozo"
                        }
                    }
                },
                include: { Usuarios: true }
            });
            return this.toDomainEntity(newWaiter);
        }
        catch (error: any) {
            if (error?.code === 'P2002' && error?.meta?.target?.includes('nombreUsuario')) {
                throw new ConflictError("Ya existe un Mozo con ese nombre de usuario");
            } else if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
                throw new ConflictError("Ya existe un Mozo con ese email");
            } else if (error?.code === 'P2002' && error?.meta?.target?.includes('dni')) {
                throw new ConflictError("Ya existe un Mozo con ese dni");
            }
            else {
                throw new ServiceError(`Error al crear el Mozo: ${error.message}`);
            }
        }
    }

    public async deleteWaiter(idMozo: string): Promise<void> {
        await prisma.usuarios.delete({
            where: { idUsuario: idMozo }
        });
    }

    public async getAllWaiters(): Promise<Waiter[]> {
        const waiters = await prisma.mozos.findMany({
            include: { Usuarios: true }
        });
        return waiters.map((waiter) => { return this.toDomainEntity(waiter) });
    }

    public async getWaiterByUserName(userName: string): Promise<Waiter> {
        const waiter = await prisma.mozos.findFirst({
            where: {
                Usuarios: { nombreUsuario: userName }
            },
            include: { Usuarios: true }
        });
        if (!waiter) {
            throw new NotFoundError(`No se encontro un Mozo con el nombre de usuario: ${userName}`);
        }
        return this.toDomainEntity(waiter);
    }

    public async updateWaiter(idMozo: string, data: PartialSchemaWaiter): Promise<Waiter> {
        try{
            const updatedWaiter = await prisma.mozos.update({
                where: { idMozo: idMozo },
                data: {
                    ...data
                },
                include: { Usuarios: true }
            });
            return this.toDomainEntity(updatedWaiter);
        }
        catch(error: any){
            if (error?.code === 'P2002' && error?.meta?.target?.includes('nombreUsuario')) {
                throw new ConflictError("Ya existe un Mozo con ese nombre de usuario");
            } else if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
                throw new ConflictError("Ya existe un Mozo con ese email");
            } else if (error?.code === 'P2002' && error?.meta?.target?.includes('dni')) {
                throw new ConflictError("Ya existe un Mozo con ese dni");
            }
            else {
                throw new ServiceError(`Error al crear el Mozo: ${error.message}`);
            }
        }
    }

    public async getWaiterById(idMozo: string): Promise<Waiter> {
        const waiter = await prisma.mozos.findUnique({
            where: { idMozo: idMozo },
            include: { Usuarios: true }
        });
        if (!waiter) {
            throw new NotFoundError("Mozo no encontrado");
        }
        return this.toDomainEntity(waiter);
    }

    private toDomainEntity(waiter: MozoWithUsuario): Waiter {
        return new Waiter(
            waiter.Usuarios.idUsuario as UUID,
            waiter.Usuarios.nombreUsuario,
            waiter.Usuarios.email,
            waiter.Usuarios.contrasenia,
            waiter.Usuarios.tipoUsuario,
            waiter.nombre,
            waiter.apellido,
            waiter.dni,
            waiter.telefono,
        );  
    }
}