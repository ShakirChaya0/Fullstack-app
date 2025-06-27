import { ProductsInterface } from '../../../domain/interfaces/products.interface.js';
import { PrismaClient, Producto, tipo } from '@prisma/client';
import { SchemaProductos } from '../../../presentation/validators/productZod.js';

const prisma = new PrismaClient();

export class productoRepository {
    static async create(product: SchemaProductos): Promise<Producto> {
        // Simulate database operation
        const createdProduct = await prisma.producto.create({
            data: {
                nombre: product.nombre,
                descripcion: product.descripcion,
                estado: product.estado,
                tipo: product.tipo as tipo,
                esSinGluten: product.esSinGluten,
                esVegana: product.esVegana,
                esVegetariana: product.esVegetariana,
                esAlcoholica: product.esAlcoholica
            }
        });
        return createdProduct;
    }
}