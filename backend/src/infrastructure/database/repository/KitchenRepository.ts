import { Prisma, PrismaClient, TipoUsuario_Type } from "@prisma/client";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";
import { Kitchen } from "../../../domain/entities/Kitchen.js";
import { UUID } from 'crypto';
import { PartialSchemaKitchen } from "../../../shared/validators/kitchenZod.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { IKitchenRepository } from "../../../domain/repositories/IKitchenRepository.js";
const prisma = new PrismaClient()

type UsuariosKitchen = Prisma.UsuariosGetPayload<{}>;

export class KitchenRepository implements IKitchenRepository{
    async getAll (tipoUsuario: TipoUsuario_Type): Promise<Kitchen | null> {
        try{
            const kitchen = await prisma.usuarios.findFirst({
                where: {tipoUsuario: tipoUsuario}
            })
            if(!kitchen) return null
            return this.toDomainEntity(kitchen)
        }
        catch(error){
            throw new ServiceError("Error al registrar la novedad en la base de datos")
        }
    }
    async update (id: string, data: PartialSchemaKitchen): Promise<Kitchen> {
        try{
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
        catch(error: any){
            if (error?.code === 'P2002' && error?.meta?.target?.includes('titulo')) {
                throw new ConflictError("Ya existe una novedad con ese título")
            }
            else{
                throw new ServiceError("Error al registrar la novedad en la base de datos")
            }
        }
    }
    private toDomainEntity(data: UsuariosKitchen){
        return new Kitchen(data.idUsuario as UUID, data.nombreUsuario, data.email, data.contrasenia, data.tipoUsuario)
    }
}