import { PartialSchemaWaiter } from '../../../shared/validators/waiterZod.js';
import { WaiterRepository } from '../../../infrastructure/database/repository/WaiterRepository.js';
import { PasswordHashingService } from '../../services/PasswordHashing.js';
import { Waiter } from '../../../domain/entities/Waiter.js';
import { NotFoundError } from '../../../shared/exceptions/NotFoundError.js';

export class CUU22ModifyWaiter {
    constructor(
        private readonly waiterRepository = new WaiterRepository(),
        private readonly passwordHashingService = new PasswordHashingService()
    ) {}

    public async execute(idMozo: string, data: PartialSchemaWaiter): Promise<Waiter> {
        const existingWaiter = await this.waiterRepository.getWaiterById(idMozo);
        if (!existingWaiter) {
            throw new NotFoundError("Mozo no encontrado");
        }

        if (data.contrasenia) {
            data.contrasenia = await this.passwordHashingService.hashPassword(data.contrasenia);
        }

        const updatedData = {
            ...existingWaiter,
            ...data,
        };

        const draft = {
            nombreUsuario: updatedData.nombreUsuario,
            contrasenia: updatedData.contrasenia,
            nombre: updatedData.nombre,
            apellido: updatedData.apellido,
            dni: updatedData.dni,
            telefono: updatedData.telefono,
            email: updatedData.email
        };

        const updatedWaiter = await this.waiterRepository.updateWaiter(idMozo, draft);
        return updatedWaiter;
    }
}