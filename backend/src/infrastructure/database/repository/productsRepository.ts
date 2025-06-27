import { PrismaClient, Producto, tipo } from '@prisma/client';
import { SchemaProductos } from '../../../presentation/validators/productZod.js';

const prisma = new PrismaClient();

export class ProductoRepository {

    static getAll(): Promise<Producto[]> {
        return prisma.producto.findMany();
    }

    static getById(idProducto: number): Promise<Producto | null> {
        return prisma.producto.findUnique({
            where: { idProducto: idProducto }
        });
    }

    static getByName(nombreProducto: string): Promise<Producto[] | null> {
        return prisma.producto.findMany({
            where: { 
                nombre: {
                    contains: nombreProducto,
                    mode: 'insensitive'
                }
            }
        })
    }

    static getByType(tipoProducto: string): Promise<Producto[] | null> {
        if (tipoProducto === "Bebida") {
            return prisma.producto.findMany({
                where: { tipo: null }
            });
        } else {
            return prisma.producto.findMany({
                where: { 
                    tipo: { not: null } 
                }
            });
        }
    }

    static create(product: SchemaProductos): Promise<Producto> {
        return prisma.producto.create({
            data: {
                ...product
            }
        });
    }

    static update(product: Producto): Promise<Producto> {
        return prisma.producto.update({
            where: { idProducto: product.idProducto },
            data: {
                ...product
            }
        });
    }
}