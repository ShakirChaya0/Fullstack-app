import prisma from "../prisma/PrismaClientConnection.js"
import { Prisma } from '@prisma/client';
import { PartialSchemaProductos, SchemaProductos } from '../../../shared/validators/ProductZod.js';
import { IProductoRepository } from '../../../domain/repositories/IProductRepository.js';
import { Product } from '../../../domain/entities/Product.js';
import { Drink } from "../../../domain/entities/Drink.js";
import { Food } from "../../../domain/entities/Food.js";

type ProductWithPrice = Prisma.ProductoGetPayload<{
    include: { Precios: true };
}>;

export class ProductRepository implements IProductoRepository {

    public async getAll(): Promise<Product[]> {
        const products = await prisma.producto.findMany({
            include: { 
                Precios: {
                    orderBy: {
                        fechaActual: 'desc' 
                    },
                    take: 1 
                } 
            }
        });
        
        return products.map((product) => { return this.toDomainEntity(product) })
    }

    public async getById(idProducto: number): Promise<Product | null> {
        const product = await prisma.producto.findUnique({
            where: { idProducto: idProducto },
            include: { 
                Precios: {
                    orderBy: {
                        fechaActual: 'desc' 
                    },
                    take: 1 
                } 
            } 
        });

        if (!product) return null;

        return this.toDomainEntity(product);
    }

    public async getByName(nombreProducto: string): Promise<Product[]> {
        const product = await prisma.producto.findMany({
            where: { 
                nombre: {
                    contains: nombreProducto,
                    mode: 'insensitive'
                }
            },
            include: { 
                Precios: {
                    orderBy: {
                        fechaActual: 'desc' 
                    },
                    take: 1 
                } 
            }        
        });

        return product.map((prod) => { return this.toDomainEntity(prod) })
    }

    public async getByUniqueName(nombreProducto: string): Promise<Product | null> {
        const product = await prisma.producto.findUnique({
            where: { nombre: nombreProducto },
            include: { 
                Precios: {
                    orderBy: {
                        fechaActual: 'desc' 
                    },
                    take: 1 
                } 
            }        
        });

        if (!product) return null;

        return this.toDomainEntity(product)
    }

    public async getByType(tipoProducto: string): Promise<Product[]> {
        if (tipoProducto === "Bebida") {
            const drinks = await prisma.producto.findMany({
                where: { tipo: null },
                include: { 
                    Precios: {
                        orderBy: {
                            fechaActual: 'desc' 
                        },
                        take: 1 
                    } 
                } 
            });

            return drinks.map((drink) => { return this.toDomainEntity(drink) });
        } else {
            const foods = await prisma.producto.findMany({
                where: { 
                    tipo: { not: null } 
                },
                include: { 
                    Precios: {
                        orderBy: {
                            fechaActual: 'desc' 
                        },
                        take: 1 
                    } 
                }            
            });

            return foods.map((food) => { return this.toDomainEntity(food) });
        }
    }

    public async create(product: SchemaProductos): Promise<Product> {
        const newProduct = await prisma.producto.create({
            data: {
                ...product
            },
            include: { 
                Precios: {
                    orderBy: {
                        fechaActual: 'desc' 
                    },
                    take: 1 
                } 
            }       
        });
        
        return this.toDomainEntity(newProduct)
    }

    public async update(product: PartialSchemaProductos, productId: number): Promise<Product> {
        const updatedProduct = await prisma.producto.update({
            where: { idProducto: productId },
            data: {
                ...product
            },
            include: { 
                Precios: {
                    orderBy: {
                        fechaActual: 'desc' 
                    },
                    take: 1 
                } 
            }      
        });

        return this.toDomainEntity(updatedProduct)
    }
    private toDomainEntity(Product: ProductWithPrice): Product {
            if (Product.tipo !== null && Product.tipo !== "EMPTY_ENUM_VALUE") {
                return new Food(
                        Product.idProducto,
                        Product.nombre,
                        Product.descripcion,
                        Product.estado,
                        Product.Precios[0].monto.toNumber(),
                        Product.esVegetariana ?? false,
                        Product.esVegana ?? false,
                        Product.esSinGluten ?? false,
                        Product.tipo
                    );
            } else {
                return new Drink(
                    Product.idProducto,
                    Product.nombre,
                    Product.descripcion,
                    Product.estado,
                    Product.Precios[0].monto.toNumber(),
                    Product.esAlcoholica ?? false
                );
            }
        }
}
