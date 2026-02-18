import { AdminRepository } from "../../../infrastructure/database/repository/AdminRepository.js";
import { Admin } from "../../../domain/entities/Admin.js";
import { PartialSchemaAdmin } from "../../../shared/validators/AdminZod.js";
import { PasswordHashingService } from "../../services/PasswordHashing.js";

export class UpdateAdminProfileUseCase {
    constructor (
        private readonly AdministradorRepository = new AdminRepository(),
        private readonly serveHashPasswordService = new PasswordHashingService()
    ) {}

    public async execute(idAdmin: string, adminData: PartialSchemaAdmin ): Promise<Admin> {
        if(adminData.contrasenia){
            adminData.contrasenia = await this.serveHashPasswordService.hashPassword(adminData.contrasenia);
        }
        return await this.AdministradorRepository.update(idAdmin, adminData);
    }
}
