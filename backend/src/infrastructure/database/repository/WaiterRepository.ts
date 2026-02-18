import prisma from "../prisma/PrismaClientConnection.js"
import { Prisma } from "@prisma/client";
import { Waiter } from "../../../domain/entities/Waiter.js";
import { IWaiterRepository } from "../../../domain/repositories/IWaiterRepository.js";
import { SchemaWaiter ,PartialSchemaWaiter } from "../../../shared/validators/WaiterZod.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";
import { UUID } from "crypto";

type MozoWithUsuario = Prisma.MozosGetPayload<{
    include: { Usuarios: true };
}>;

const limit = 5

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
            } else if (error?.code === 'P2002' && error?.meta?.target?.includes('telefono')) {
                throw new ConflictError("Ya existe un Mozo con ese telefono");
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

    public async getAllWaiters(page: number): Promise<{Waiters: Waiter[], totalItems: number, pages: number}> {
        const skip = (page - 1) * limit
        const waiters = await prisma.mozos.findMany({
            skip: skip,
            take: limit,
            include: { Usuarios: true }
        });
        const totalItems = await prisma.mozos.count()
        const pages = Math.ceil(totalItems / limit)

        return { Waiters: waiters.map((waiter) => { return this.toDomainEntity(waiter) }), totalItems: totalItems, pages: pages }
    }

    public async getWaiterByUserName(userName: string, page: number): Promise<{Waiters: Waiter[], totalItems: number, pages: number}> {
        const skip = (page - 1) * limit

        const whereClause = {
            Usuarios: { 
                nombreUsuario: {
                    contains: userName,
                    mode: Prisma.QueryMode.insensitive
                } 
            }
        }

        const waiters = await prisma.mozos.findMany({
            skip: skip,
            take: limit,
            where: whereClause,
            include: { Usuarios: true }
        });
        const totalItems = await prisma.mozos.count({
            where: whereClause
        })
        const pages = Math.ceil(totalItems / limit)

        return {Waiters: waiters.map((waiter) => { return this.toDomainEntity(waiter) }), totalItems: totalItems, pages: pages}
    }

    public async updateWaiter(idMozo: string, data: PartialSchemaWaiter): Promise<Waiter> {
        try{
            const { nombreUsuario, email, contrasenia, ...mozoFields } = data

            const updatedWaiter = await prisma.mozos.update({
                where: { idMozo },
                data: {
                  ...mozoFields,
                  Usuarios: {
                    update: {
                      data: {
                        ...(nombreUsuario && { nombreUsuario }),
                        ...(email && { email }),
                        ...(contrasenia && { contrasenia }),
                      },
                    },
                  },
                },
                include: { Usuarios: true },
            });

            return this.toDomainEntity(updatedWaiter);
        }
        catch(error: any){
            if (error?.code === 'P2002' && error?.meta?.target?.includes('nombreUsuario')) {
                throw new ConflictError("El nombre de usuario ingresado ya está en uso");
            } else if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
                throw new ConflictError("El email ingresado ya está en uso");
            } else if (error?.code === 'P2002' && error?.meta?.target?.includes('dni')) {
                throw new ConflictError("El DNI ingresado ya está en uso");
            }
            else {
                throw new ServiceError(`Error al actualizar datos del usuario: ${error.message}. Inténtelo de nuevo más tarde`);
            }
        }
    }

    public async getWaiterById(idMozo: string): Promise<Waiter | null> {
        const waiter = await prisma.mozos.findUnique({
            where: { idMozo: idMozo },
            include: { Usuarios: true },
        });


        if (!waiter) return null;

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