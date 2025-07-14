import { Prisma, PrismaClient } from "@prisma/client";
import { SchemaPrice } from "../../../shared/validators/priceZod.js";
import { IPriceRepository } from "../../../domain/repositories/IPriceRepository.js";
import { Price } from "../../../domain/entities/Price.js";
import { Drink, Food, Product } from "../../../domain/entities/Product.js";

const prisma = new PrismaClient();

type PriceWithProduct = Prisma.PreciosGetPayload<{
    include: { Producto: true };
}>;

export class PriceRepository implements IPriceRepository {

    public async getAll(): Promise<Price[]> {
        const prices = await prisma.precios.findMany({
            include: { Producto: true },
            orderBy: { idProducto: 'asc' }
        });

        return prices.map((price) => { return this.toDomainEntity(price) });
    }

    public async getByProduct(product: Product): Promise<Price[]> {
        const prices = await prisma.precios.findMany({
            where: { idProducto: product.productId },
            include: { Producto: true }
        });

        return prices.map((price) => { return this.toDomainEntity(price) });
    }

    public async getOne(productId: number, dateFrom: Date): Promise<Price | null> {
        const price = await prisma.precios.findUnique({
            where: {
                idProducto_fechaActual: {
                    idProducto: productId,
                    fechaActual: dateFrom
                }
            },
            include: { Producto: true }
        });

        if (!price) return null;

        return this.toDomainEntity(price);
    }

    public async getActual(product: Product): Promise<Price | null> {
        const price = await prisma.precios.findFirst({
            where: { idProducto: product.productId },
            orderBy: { fechaActual: 'desc' },
            include: { Producto: true }
        });

        if (!price) return null;

        return this.toDomainEntity(price);
    }

    public async create(price: SchemaPrice): Promise<Price> {
        const today = new Date();
        const newPrice = await prisma.precios.create({
            data: {
                ...price,
                fechaActual: today
            },
            include: { Producto: true }
        });

        return this.toDomainEntity(newPrice);
    }

    public async delete(productId: number, dateFrom: Date): Promise<void> {
        await prisma.precios.delete({
            where: {
                idProducto_fechaActual: {
                    idProducto: productId,
                    fechaActual: dateFrom
                }
            }
        });
    }

    private toDomainEntity(price: PriceWithProduct): Price {
        let product: Product;
        if (price.Producto.tipo !== null && price.Producto.tipo !== "EMPTY_ENUM_VALUE") {
            product = new Food(
                price.Producto.idProducto,
                price.Producto.nombre,
                price.Producto.descripcion,
                price.Producto.estado,
                price.Producto.esVegetariana ?? false,
                price.Producto.esVegana ?? false,
                price.Producto.esSinGluten ?? false,
                price.Producto.tipo
            );
        } else {
            product = new Drink(
                price.Producto.idProducto,
                price.Producto.nombre,
                price.Producto.descripcion,
                price.Producto.estado,
                price.Producto.esAlcoholica ?? false
            );
        }
        return new Price(product, price.fechaActual, price.monto);
    }
}