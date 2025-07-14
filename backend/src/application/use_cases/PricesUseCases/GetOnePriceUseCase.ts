import { Price } from "../../../domain/entities/Price.js";
import { PriceRepository } from "../../../infrastructure/database/repository/PriceRepository.js";

export class GetOnePriceUseCase {
    constructor(
        private readonly priceRepository = new PriceRepository()
    ) {}

    public async execute(productId: number, dateFrom: Date): Promise<Price | null> {
        const price = await this.priceRepository.getOne(productId, dateFrom);
        return price;
    }
}