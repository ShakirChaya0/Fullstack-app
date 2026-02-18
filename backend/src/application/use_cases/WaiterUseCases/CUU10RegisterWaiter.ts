import { WaiterRepository } from '../../../infrastructure/database/repository/WaiterRepository.js'; 
import { SchemaWaiter } from '../../../shared/validators/WaiterZod.js';
import { PasswordHashingService } from '../../services/PasswordHashing.js';
import { Waiter } from '../../../domain/entities/Waiter.js';

export class CUU10RegisterWaiter {
    constructor(
        private readonly waiterRepository = new WaiterRepository(),
        private readonly passwordHashingService = new PasswordHashingService()
    ) {}

    public async execute(data: SchemaWaiter): Promise<Waiter> {
        const hashedPassword = await this.passwordHashingService.hashPassword(data.contrasenia);
        const newWaiterData = {
            ...data,
            contrasenia: hashedPassword,
        };

        return await this.waiterRepository.createWaiter(newWaiterData);
    }
}