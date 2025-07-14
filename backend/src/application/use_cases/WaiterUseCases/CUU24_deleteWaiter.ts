import { Prisma } from '@prisma/client';
import { WaiterRepository } from '../../../infrastructure/database/repository/WaiterRepository.js';
import { NotFoundError } from '../../../shared/exceptions/NotFoundError.js';

export class CUU24DeleteWaiter {
    constructor(
        private readonly waiterRepository = new WaiterRepository()
    ) {}

    public async execute(idMozo: string): Promise<void> {
        try {
            await this.waiterRepository.deleteWaiter(idMozo);
        }
        catch(error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
                throw new NotFoundError("Mozo no encontrado");
            throw error;
        }
    }
}