import { SchemaWaiter } from '../../../shared/validators/waiterZod.js';
import { WaiterRepository } from '../../../infrastructure/database/repository/WaiterRepository.js';
import { PasswordHashingService } from '../../services/PasswordHashing.js';
import { Waiter } from '../../../domain/entities/Waiter.js';

export class CUU22ModifyWaiter {
    constructor(
        private readonly waiterRepository = new WaiterRepository(),
        private readonly passwordHashingService = new PasswordHashingService()
    ) {}

    public async execute(id: number, data: SchemaWaiter): Promise<Waiter> {
        const existingWaiter = await this.waiterRepository.getWaiterById(id);
        if (!existingWaiter) {
            throw new Error(`Waiter with ID ${id} not found`);
        }

        if (data.contrasenia) {
            data.contrasenia = await this.passwordHashingService.hashPassword(data.contrasenia);
        }

        const updatedData = {
            ...existingWaiter,
            ...data,
        };

        const updatedWaiter = await this.waiterRepository.updateWaiter(id, updatedData);
        return updatedWaiter;
    }
}