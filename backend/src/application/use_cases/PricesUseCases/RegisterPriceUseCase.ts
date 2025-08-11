import { Price } from "../../../domain/entities/Price.js";
import { PriceRepository } from "../../../infrastructure/database/repository/PriceRepository.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { SchemaPrice } from "../../../shared/validators/Fix_priceZod.js";

export class RegisterPriceUseCase {
    constructor(
        private readonly productRepository = new ProductRepository(),
        private readonly priceRepository = new PriceRepository()
    ) {}

    public async execute(data: SchemaPrice): Promise<Price> {
        const product = await this.productRepository.getById(data.idProducto);

        if (!product) throw new NotFoundError("Producto no encontrado");

        const price = await this.priceRepository.create(data);
        return price;
    }
}