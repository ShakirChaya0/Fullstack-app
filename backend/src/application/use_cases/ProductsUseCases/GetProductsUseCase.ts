import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { Product } from "../../../domain/entities/Product.js";

export class GetProductsUseCase {
    constructor(
        private readonly productRepository = new ProductRepository()
    ) {}
    
    public async execute(): Promise<Product[]> {
        return await this.productRepository.getAll();
    }
}