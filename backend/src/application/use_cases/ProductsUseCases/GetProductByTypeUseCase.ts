import { Product } from "../../../domain/entities/Product.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";

export class GetProductByTypeUseCase {
    constructor(
        private readonly productRepository = new ProductRepository()
    ) {}

    public async execute(tipoProducto: string): Promise<Product[]> {
        return await this.productRepository.getByType(tipoProducto);
    }
}