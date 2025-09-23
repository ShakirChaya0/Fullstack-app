import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { Product } from "../../../domain/entities/Product.js";
import { ProductsPaginated } from "../../../domain/interfaces/ProductsPaginated.interface.js";

export class GetProductsUseCase {
    constructor(
        private readonly productRepository = new ProductRepository()
    ) {}
    
    public async execute(): Promise<Product[]> {
        return await this.productRepository.getAll();
    }

    public async executePaginated(page: number, limit: number): Promise<ProductsPaginated> {
        return await this.productRepository.getAllPaginated(page, limit)
    }
}