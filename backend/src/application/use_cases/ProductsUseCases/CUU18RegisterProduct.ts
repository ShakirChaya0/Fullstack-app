import { Product } from "../../../domain/entities/Product.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { SchemaProductos } from '../../../shared/validators/productZod.js';

export class CUU18RegisterProduct {
  constructor(
    private readonly productRepository = new ProductRepository()
  ) {}

  public async execute(product: SchemaProductos): Promise<Product> {
    const existingProduct = await this.productRepository.getByName(product.nombre);
    if (existingProduct.length > 0) {
      throw new Error(`A product with the name ${product.nombre} already exists`);
    }
    const productoDatabase = await this.productRepository.create(product);
    return productoDatabase;
  }
}