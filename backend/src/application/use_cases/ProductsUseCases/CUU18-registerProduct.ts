import { ProductoRepository } from '../../infrastructure/database/repository/productsRepository.js';
import { Producto } from '@prisma/client';
import { SchemaProductos } from '../../presentation/validators/productZod.js';

export class CUU18RegisterProducts {
  static async execute(product: SchemaProductos): Promise<Producto> {    
    const productoDatabase = await ProductoRepository.create(product);
    return productoDatabase;
  }
}