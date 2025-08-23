import prisma from "../prisma/PrismaClientConnection.js"
import { ISuggestionRepository } from "../../../domain/repositories/ISuggestionRepository.js";
import { Suggestion } from "../../../domain/entities/Suggestion.js";
import { Product } from "../../../domain/entities/Product.js";
import { Prisma } from "@prisma/client";
import { PartialSchemaSuggestion } from "../../../shared/validators/SuggestionZod.js";
import { Food } from "../../../domain/entities/Food.js";
import { Drink } from "../../../domain/entities/Drink.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";

type SuggestionWithProduct = Prisma.SugerenciasGetPayload<{
    include: { Producto: { include: { Precios: true }} }
}>;

export class SuggestionRepository implements ISuggestionRepository {
    
    public async getAll(): Promise<Suggestion[]> {
        const suggestions = await prisma.sugerencias.findMany({
            include: {
                Producto: { include: { Precios: true }}
            }
        });

        return suggestions.map((sugg) => { return this.toDomainEntity(sugg) });
    }

    public async getActiveSuggestions(): Promise<Suggestion[]> {
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const suggestions = await prisma.sugerencias.findMany({
            where: {
                fechaDesde: { lte: now },
                fechaHasta: { gte: now }
            },
            include: {
                Producto: { include: { Precios: true }}
            }
        });

        return suggestions.map((sugg) => { return this.toDomainEntity(sugg) });
    }

    public async findByProductAndDate(productId: number, dateFrom: Date): Promise<Suggestion | null> {
        const suggestion = await prisma.sugerencias.findUnique({
            where: {
                idProducto_fechaDesde: {
                    idProducto: productId,
                    fechaDesde: dateFrom
                }
            },
            include: {
                Producto: { include: { Precios: true } }
            }
        });

        if (!suggestion) return null;

        return this.toDomainEntity(suggestion);
    }

    public async create(productId: number, dateFrom: Date, dateTo: Date): Promise<Suggestion> {
        const newSuggestion = await prisma.sugerencias.create({
            data: {
                fechaDesde: dateFrom,
                fechaHasta: dateTo,
                idProducto: productId
            },
            include: {
                Producto: { include: { Precios: true } }
            }
        });

        return this.toDomainEntity(newSuggestion);
    }

    public async update(data: PartialSchemaSuggestion, idProducto: number, fechaDesde: Date): Promise<Suggestion> {       
        try {
            const updatedSuggestion = await prisma.sugerencias.update({
                where: { 
                    idProducto_fechaDesde: {
                        idProducto: idProducto,
                        fechaDesde: fechaDesde
                    }
                },
                data: { ...data },
                include: {
                    Producto: { include: { Precios: true } }
                }
            });

            return this.toDomainEntity(updatedSuggestion);
        } catch (error: any) {
            if (error?.code === 'P2002') {
                throw new ConflictError("Ya existe una sugerencia para ese producto con esa fecha desde")
            }
            else {
                throw new ServiceError(`Error al registrar la sugerencia en la base de datos: ${error}`)
            }
        }
    }

    private toDomainEntity(sugg: SuggestionWithProduct): Suggestion {
        let product: Product;
        if (sugg.Producto.tipo !== null && sugg.Producto.tipo !== "EMPTY_ENUM_VALUE") {
            product = new Food(
                sugg.Producto.idProducto,
                sugg.Producto.nombre,
                sugg.Producto.descripcion,
                sugg.Producto.estado,
                sugg.Producto.Precios[sugg.Producto.Precios.length - 1].monto.toNumber(),
                sugg.Producto.esVegetariana ?? false,
                sugg.Producto.esVegana ?? false,
                sugg.Producto.esSinGluten ?? false,
                sugg.Producto.tipo
            );
        } else {
            product = new Drink(
                sugg.Producto.idProducto,
                sugg.Producto.nombre,
                sugg.Producto.descripcion,
                sugg.Producto.estado,
                sugg.Producto.Precios[sugg.Producto.Precios.length - 1].monto.toNumber(),
                sugg.Producto.esAlcoholica ?? false
            );
        }

        return new Suggestion(
            product,
            sugg.fechaDesde,
            sugg.fechaHasta
        );
    }
}