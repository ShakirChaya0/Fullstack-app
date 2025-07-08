import { Product } from "../../../domain/entities/Product.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";

export class GetProductByIdUseCase {
    constructor(
        private readonly productRepository = new ProductRepository()
    ) {}
    
    public async execute(idProducto: number): Promise<Product | null> {
        return await this.productRepository.getById(idProducto);
    }
}