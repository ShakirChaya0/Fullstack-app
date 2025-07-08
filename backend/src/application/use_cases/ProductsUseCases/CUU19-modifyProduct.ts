import { ProductoRepository } from '../../../infrastructure/database/repository/productsRepository.js';
import { Producto } from '@prisma/client';
import { PartialSchemaProductos } from '../../../presentation/validators/productZod.js';

export class CUU19ModifyProduct {
  static async execute(idProducto: number, partialProduct: PartialSchemaProductos): Promise<Producto> {
    const existingProduct = await ProductoRepository.getById(idProducto);
    if (!existingProduct) {
      throw new Error(`Product with ID ${idProducto} not found`);
    }
    const updatedProduct = {
      ...existingProduct,
      ...partialProduct,
    };
    
    const productoDatabase = await ProductoRepository.update(updatedProduct);
    return productoDatabase;
  }
}