import { Admin } from "../entities/Admin.js"; 
import { PartialSchemaAdmin } from "../../shared/validators/AdminZod.js";
import { UserType } from "../../shared/types/SharedTypes.js";

export interface IAdminRepository {
    getAdmin(tipoUsuario: UserType): Promise<Admin | null>
    update(idAdmin: string, admin: PartialSchemaAdmin): Promise<Admin>;
}