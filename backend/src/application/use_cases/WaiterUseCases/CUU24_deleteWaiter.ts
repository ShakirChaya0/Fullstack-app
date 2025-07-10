import { WaiterRepository } from '../../../infrastructure/database/repository/WaiterRepository.js';

export class CUU24DeleteWaiter {
    constructor(
        private readonly waiterRepository = new WaiterRepository()
    ) {}

    public async execute(idMozo: string): Promise<{ message: string }> {
        return await this.waiterRepository.deleteWaiter(idMozo);
    }
}