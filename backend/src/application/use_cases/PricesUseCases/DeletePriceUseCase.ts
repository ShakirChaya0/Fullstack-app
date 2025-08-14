import { PriceRepository } from "../../../infrastructure/database/repository/PriceRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class DeletePriceUseCase {
    constructor(
        private readonly priceRepository = new PriceRepository()
    ) {}

    public async execute(productId: number, dateFrom: Date): Promise<void> {
        const priceFound = await this.priceRepository.getOne(productId, dateFrom);
        if (!priceFound) throw new NotFoundError("Precio no encontrado");

        await this.priceRepository.delete(productId, dateFrom);
    }
}