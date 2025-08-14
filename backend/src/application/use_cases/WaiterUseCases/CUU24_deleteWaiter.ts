import { WaiterRepository } from '../../../infrastructure/database/repository/WaiterRepository.js';
import { NotFoundError } from '../../../shared/exceptions/NotFoundError.js';

export class CUU24DeleteWaiter {
    constructor(
        private readonly waiterRepository = new WaiterRepository()
    ) {}

    public async execute(idMozo: string): Promise<void> {
        const waiterFound = await this.waiterRepository.getWaiterById(idMozo);
        if (!waiterFound) throw new NotFoundError("Mozo no encontrado");

        await this.waiterRepository.deleteWaiter(idMozo);
    }
}