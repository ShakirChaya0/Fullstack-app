import { PrismaClient } from '@prisma/client';
import { PartialSchemaProductos, SchemaProductos } from '../../../shared/validators/productZod.js';
import { IProductoRepository } from '../../../domain/repositories/IProductRepository.js';
import { Product, Food, Drink, FoodType } from '../../../domain/entities/Product.js';
import { Producto as PrismaProducto } from '@prisma/client';

const prisma = new PrismaClient();

export class ProductRepository implements IProductoRepository{

    public async getAll(): Promise<Product[]> {
        const products = await prisma.producto.findMany();
        
        return products.map((product: PrismaProducto) => {
            if (product.tipo !== null && product.tipo !== "EMPTY_ENUM_VALUE") {
                return new Food(
                    product.idProducto,
                    product.nombre,
                    product.descripcion,
                    product.estado,
                    product.esVegetariana || false,
                    product.esVegana || false,
                    product.esSinGluten || false,
                    product.tipo
                );
            } else {
                return new Drink(
                    product.idProducto,
                    product.nombre,
                    product.descripcion,
                    product.estado,
                    product.esAlcoholica || false
                );
            }
        })
    }

    public async getById(idProducto: number): Promise<Product | null> {
        const product = await prisma.producto.findUnique({
            where: { idProducto: idProducto }
        });

        if (!product) {
            return null;
        }

        if (product.tipo !== null && product.tipo !== "EMPTY_ENUM_VALUE") {
            return new Food(
                product.idProducto,
                product.nombre,
                product.descripcion,
                product.estado,
                product.esVegetariana || false,
                product.esVegana || false,
                product.esSinGluten || false,
                product.tipo
            );
        } else {
            return new Drink(
                product.idProducto,
                product.nombre,
                product.descripcion,
                product.estado,
                product.esAlcoholica || false
            );
        }
    }

    public async getByName(nombreProducto: string): Promise<Product[]> {
        const product = await prisma.producto.findMany({
            where: { 
                nombre: {
                    contains: nombreProducto,
                    mode: 'insensitive'
                }
            }
        });

        return product.map((prod: PrismaProducto) => {
            if (prod.tipo !== null && prod.tipo !== "EMPTY_ENUM_VALUE") {
                return new Food(
                    prod.idProducto,
                    prod.nombre,
                    prod.descripcion,
                    prod.estado,
                    prod.esVegetariana || false,
                    prod.esVegana || false,
                    prod.esSinGluten || false,
                    prod.tipo
                );
            } else {
                return new Drink(
                    prod.idProducto,
                    prod.nombre,
                    prod.descripcion,
                    prod.estado,
                    prod.esAlcoholica || false
                );
            }
        });
    }

    public async getByUniqueName(nombreProducto: string): Promise<Product | null> {
        const product = await prisma.producto.findUnique({
            where: { nombre: nombreProducto }
        });

        if (!product) {
            return null;
        }

        if (product.tipo !== null && product.tipo !== "EMPTY_ENUM_VALUE") {
            return new Food(
                product.idProducto,
                product.nombre,
                product.descripcion,
                product.estado,
                product.esVegetariana || false,
                product.esVegana || false,
                product.esSinGluten || false,
                product.tipo
            );
        } else {
            return new Drink(
                product.idProducto,
                product.nombre,
                product.descripcion,
                product.estado,
                product.esAlcoholica || false
            );
        }
    }

    public async getByType(tipoProducto: string): Promise<Product[]> {
        if (tipoProducto === "Bebida") {
            const drinks = await prisma.producto.findMany({
                where: { tipo: null }
            });

            return drinks.map((drink: PrismaProducto) => {
                return new Drink(
                    drink.idProducto,
                    drink.nombre,
                    drink.descripcion,
                    drink.estado,
                    drink.esAlcoholica || false
                );
            });

        } else {
            const foods = await prisma.producto.findMany({
                where: { 
                    tipo: { not: null } 
                }
            });

            return foods.map((food: PrismaProducto) => {                
                return new Food(
                    food.idProducto,
                    food.nombre,
                    food.descripcion,
                    food.estado,
                    food.esVegetariana || false,
                    food.esVegana || false,
                    food.esSinGluten || false,
                    food.tipo as FoodType
                );
            });
        }
    }

    public async create(product: SchemaProductos): Promise<Product> {
        const newProduct = await prisma.producto.create({
            data: {
                ...product
            }
        });
        
        if (newProduct.tipo !== null && newProduct.tipo !== "EMPTY_ENUM_VALUE") {
            return new Food(
                newProduct.idProducto,
                newProduct.nombre,
                newProduct.descripcion,
                newProduct.estado,
                newProduct.esVegetariana || false,
                newProduct.esVegana || false,
                newProduct.esSinGluten || false,
                newProduct.tipo
            );
        } else {
            return new Drink(
                newProduct.idProducto,
                newProduct.nombre,
                newProduct.descripcion,
                newProduct.estado,
                newProduct.esAlcoholica || false
            );
        }
    }

    public async update(product: PartialSchemaProductos, productId: number): Promise<Product> {
        const updatedProduct = await prisma.producto.update({
            where: { idProducto: productId },
            data: {
                ...product
            }
        });

        if (updatedProduct.tipo !== null && updatedProduct.tipo !== "EMPTY_ENUM_VALUE") {
            return new Food(
                updatedProduct.idProducto,
                updatedProduct.nombre,
                updatedProduct.descripcion,
                updatedProduct.estado,
                updatedProduct.esVegetariana || false,
                updatedProduct.esVegana || false,
                updatedProduct.esSinGluten || false,
                updatedProduct.tipo
            );
        } else {
            return new Drink(
                updatedProduct.idProducto,
                updatedProduct.nombre,
                updatedProduct.descripcion,
                updatedProduct.estado,
                updatedProduct.esAlcoholica || false
            );
        }
    }
}
