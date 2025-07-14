import { Prisma } from "@prisma/client";
import { PriceRepository } from "../../../infrastructure/database/repository/PriceRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class DeletePriceUseCase {
    constructor(
        private readonly priceRepository = new PriceRepository()
    ) {}

    public async execute(productId: number, dateFrom: Date): Promise<void> {
        try {
            await this.priceRepository.delete(productId, dateFrom);
        }
        catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
                throw new NotFoundError("Precio no encontrado");
            throw error;
        }
    }
}