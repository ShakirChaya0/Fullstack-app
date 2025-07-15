import { TipoUsuario_Type } from "@prisma/client";
import { Admin } from "../entities/Admin.js"; 
import { PartialSchemaAdmin } from "../../shared/validators/adminZod.js";

export interface IAdminRepository {
    getAdmin(tipoUsuario: TipoUsuario_Type): Promise<Admin | null>

    update(idAdmin: string, admin: PartialSchemaAdmin): Promise<Admin>;
}