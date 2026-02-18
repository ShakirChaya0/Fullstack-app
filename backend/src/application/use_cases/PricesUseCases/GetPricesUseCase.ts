import { Price } from "../../../domain/entities/Price.js";
import { PriceRepository } from "../../../infrastructure/database/repository/PriceRepository.js";

export class GetPricesUseCase {
    constructor(
        private readonly priceRepository = new PriceRepository()
    ) {}

    public async execute(): Promise<Price[] | null> {
        const price = await this.priceRepository.getAll();
        return price;
    }
}