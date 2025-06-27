import { ProductsInterface } from '../../domain/interfaces/products.interface.js';
import { productoRepository } from '../../infrastructure/database/repository/productsRepository.js';
import { Producto } from '@prisma/client';
import { ValidateProduct } from '../../presentation/validators/productZod.js';

export class CUU18RegisterProducts {
  static async execute(product: Producto): Promise<Producto> {
    // Validate products
    const validatedProduct = ValidateProduct(product);

    if(!validatedProduct.success) throw new Error(`Validation failed: ${validatedProduct.error.message}`);
    // Simulate product registration logic
    const registeredProducts = {
      ...validatedProduct.data
    };

    const productoDatabase = await productoRepository.create(registeredProducts);

    // Return the registered products
    return productoDatabase;
  }
}