import { Prisma } from "@prisma/client";
import prisma from "../prisma/PrismaClientConnection.js"
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";
import { Kitchen } from "../../../domain/entities/Kitchen.js";
import { UUID } from 'crypto';
import { PartialSchemaKitchen } from "../../../shared/validators/KitchenZod.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { IKitchenRepository } from "../../../domain/repositories/IKitchenRepository.js";
import { UserType } from "../../../shared/types/SharedTypes.js";

type UsuariosKitchen = Prisma.UsuariosGetPayload<{}>;

export class KitchenRepository implements IKitchenRepository{
    async getAll(tipoUsuario: UserType): Promise<Kitchen | null> {
        try {
            const kitchen = await prisma.usuarios.findFirst({
                where: {tipoUsuario: tipoUsuario}
            })
            if (!kitchen) return null
            return this.toDomainEntity(kitchen)
        }
        catch (error) {
            throw new ServiceError("Error al registrar la novedad en la base de datos")
        }
    }

    async update(id: string, data: PartialSchemaKitchen): Promise<Kitchen> {
        try {
            const kitchen = await prisma.usuarios.update({
                where: {
                    idUsuario: id
                },
                data: {
                    ...data
                }
            })
            return this.toDomainEntity(kitchen)
            
        }
        catch (error: any) {
            if (error?.code === 'P2002' && error?.meta?.target?.includes('nombreUsuario')) {
                throw new ConflictError("El nombre de usuario ingresado ya está en uso")
            }
            else if (error?.code === 'P2002' && error?.meta?.target?.includes('email')){
                throw new ConflictError("El email ingresado ya está en uso")
            }
            else {
                throw new ServiceError(`Error al actualizar datos del usuario: ${error.message}. Inténtelo de nuevo más tarde`)
            }
        }
    }

    private toDomainEntity(data: UsuariosKitchen) {
        return new Kitchen(data.idUsuario as UUID, data.nombreUsuario, data.email, data.contrasenia, data.tipoUsuario)
    }
}