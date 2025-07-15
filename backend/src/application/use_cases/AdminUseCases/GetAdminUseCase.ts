import { AdminRepository } from "../../../infrastructure/database/repository/AdminRepository.js";
import { Admin } from "../../../domain/entities/Admin.js";


export class GetAdminUseCase {
    constructor (
        private readonly AdministradorRepository = new AdminRepository()
    ) {}

    public async execute(): Promise<Admin | null> {
        return await this.AdministradorRepository.getAdmin();
    }
}