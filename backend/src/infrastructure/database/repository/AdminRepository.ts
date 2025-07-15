import { PrismaClient } from "@prisma/client";
import { IAdminRepository } from "../../../domain/repositories/IAdminRepository.js";
import { Admin } from "../../../domain/entities/Admin.js";
import { PartialSchemaAdmin } from "../../../shared/validators/adminZod.js";
import { UUID } from "crypto";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";

const prisma = new PrismaClient();

export class AdminRepository implements IAdminRepository {

    public async getAdmin(): Promise<Admin | null>{
        const admin = await prisma.usuarios.findFirst({
            where: {tipoUsuario: "Administrador"}
        });

        if (!admin) return null

        const adminDetalle = await prisma.administrador.findFirst({
            where: {idAdmin: admin?.idUsuario}
        });

        if (!adminDetalle) return null

        return new Admin(
            admin.idUsuario as UUID,
            admin.nombreUsuario,
            admin.email,
            admin.contrasenia,
            admin.tipoUsuario,
            adminDetalle.nombre,
            adminDetalle.apellido,
            adminDetalle.dni,
            adminDetalle.telefono
        );
    }

    public async update(idAdmin: string, admin: PartialSchemaAdmin): Promise<Admin> {
        try {
            const adminActualizar = await prisma.usuarios.update({
            where: {idUsuario: idAdmin},
            data: {
                nombreUsuario: admin.nombreUsuario,
                email: admin.email,
                contrasenia: admin.contrasenia
            }
            });

            const adminActualizarDetalle = await prisma.administrador.update({
                where : { idAdmin: idAdmin},
                data: {
                    nombre: admin.nombre,
                    apellido: admin.apellido,
                    dni: admin.dni,
                    telefono: admin.telefono
                }
            });

            return new Admin(
                adminActualizar.idUsuario as UUID,
                adminActualizar.nombreUsuario,
                adminActualizar.email,
                adminActualizar.contrasenia,
                adminActualizar.tipoUsuario,
                adminActualizarDetalle.nombre,
                adminActualizarDetalle.apellido,
                adminActualizarDetalle.dni,
                adminActualizarDetalle.telefono 
            )

        }catch(error: any){
            if (error?.code === 'P2002' && error?.meta?.target?.includes('nombreUsuario')) {
                throw new ConflictError("El nombreUsuario ingresado ya esta registrado");
            } else if(error?.code === 'P2002' && error?.meta?.target?.includes('email')){
                throw new ConflictError("El email ingresado ya esta en uso");
            } else if(error?.code === 'P2002' && error?.meta?.target?.includes('dni')){
                throw new ConflictError("El DNI ingresado ya esta registrado");
            }
            else{
                throw new ServiceError(`Error al crear el Mozo: ${error.message}`);
            }
        }
    }
}

