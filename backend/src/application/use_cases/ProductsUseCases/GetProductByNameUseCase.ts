import { Product } from "../../../domain/entities/Product.js";
import { ProductsPaginated } from "../../../domain/interfaces/ProductsPaginated.interface.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";

export class GetProductByNameUseCase {
    constructor(
        private readonly productRepository = new ProductRepository()
    ) {}

    public async execute(nombreProducto: string): Promise<Product[] | null> {
        return await this.productRepository.getByName(nombreProducto);
    }

    public async executePaginated(page: number, limit: number, nombreProducto: string): Promise<ProductsPaginated> {
        return await this.productRepository.getByNamePaginated(page, limit, nombreProducto);
    }
}