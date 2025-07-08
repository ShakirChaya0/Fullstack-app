import { Product } from "../../../domain/entities/Product.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";

export class GetProductByNameUseCase {
    constructor(
        private readonly productRepository = new ProductRepository()
    ) {}

    public async execute(nombreProducto: string): Promise<Product[] | null> {
        return await this.productRepository.getByName(nombreProducto);
    }
}