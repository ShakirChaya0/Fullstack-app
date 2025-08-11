import { Product } from "../../../domain/entities/Product.js";
import { ProductRepository } from "../../../infrastructure/database/repository/ProductRepository.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { SchemaProductos } from '../../../shared/validators/Fix_productZod.js';

export class CUU18RegisterProduct {
  constructor(
    private readonly productRepository = new ProductRepository()
  ) {}

  public async execute(product: SchemaProductos): Promise<Product> {
    const existingProduct = await this.productRepository.getByName(product.nombre);
    if (existingProduct.length > 0) {
      throw new ConflictError(`Ya existe un producto con el nombre: ${product.nombre}`);
    }
    const productoDatabase = await this.productRepository.create(product);
    return productoDatabase;
  }
}