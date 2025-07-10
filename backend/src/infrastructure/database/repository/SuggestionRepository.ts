import { ISuggestionRepository } from "../../../domain/repositories/ISuggestionRepository.js";
import { Suggestion } from "../../../domain/entities/Suggestion.js";
import { Drink, Food, Product } from "../../../domain/entities/Product.js";
import { PrismaClient } from "@prisma/client";
import { PartialSchemaSuggestion } from "../../../shared/validators/suggestionZod.js";

const prisma = new PrismaClient();

export class SuggestionRepository implements ISuggestionRepository {
    
    public async getAll(): Promise<Suggestion[]> {
        const suggestions = await prisma.sugerencias.findMany({
            include: {
                Producto: true
            }
        });

        return suggestions.map((sugg) => {
            let product: Product;
            if (sugg.Producto.tipo !== null && sugg.Producto.tipo !== "EMPTY_ENUM_VALUE") {
                product = new Food(
                    sugg.Producto.idProducto,
                    sugg.Producto.nombre,
                    sugg.Producto.descripcion,
                    sugg.Producto.estado,
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
                    sugg.Producto.esAlcoholica ?? false
                );
            }
            return new Suggestion(
                product,
                sugg.fechaDesde,
                sugg.fechaHasta
            );
        });
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
                Producto: true
            }
        });

        return suggestions.map((sugg) => {
            let product: Product;
            if (sugg.Producto.tipo !== null && sugg.Producto.tipo !== "EMPTY_ENUM_VALUE") {
                product = new Food(
                    sugg.Producto.idProducto,
                    sugg.Producto.nombre,
                    sugg.Producto.descripcion,
                    sugg.Producto.estado,
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
                    sugg.Producto.esAlcoholica ?? false
                );
            }
            return new Suggestion(
                product,
                sugg.fechaDesde,
                sugg.fechaHasta
            );
        });
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
                Producto: true
            }
        });

        if (!suggestion) return null;

        let product: Product;
        if (suggestion.Producto.tipo !== null && suggestion.Producto.tipo !== "EMPTY_ENUM_VALUE") {
            product = new Food(
                suggestion.Producto.idProducto,
                suggestion.Producto.nombre,
                suggestion.Producto.descripcion,
                suggestion.Producto.estado,
                suggestion.Producto.esVegetariana ?? false,
                suggestion.Producto.esVegana ?? false,
                suggestion.Producto.esSinGluten ?? false,
                suggestion.Producto.tipo
            );
        } else {
            product = new Drink(
                suggestion.Producto.idProducto,
                suggestion.Producto.nombre,
                suggestion.Producto.descripcion,
                suggestion.Producto.estado,
                suggestion.Producto.esAlcoholica ?? false
            );
        }

        return new Suggestion(
            product,
            suggestion.fechaDesde,
            suggestion.fechaHasta
        );
    }

    public async create(sugg: Suggestion): Promise<Suggestion> {
        const newSuggestion = await prisma.sugerencias.create({
            data: {
                fechaDesde: sugg.dateFrom,
                fechaHasta: sugg.dateTo,
                idProducto: sugg.product.productId
            },
            include: {
                Producto: true
            }
        });

        let product: Product;
        if (newSuggestion.Producto.tipo !== null && newSuggestion.Producto.tipo !== "EMPTY_ENUM_VALUE") {
            product = new Food(
                newSuggestion.Producto.idProducto,
                newSuggestion.Producto.nombre,
                newSuggestion.Producto.descripcion,
                newSuggestion.Producto.estado,
                newSuggestion.Producto.esVegetariana ?? false,
                newSuggestion.Producto.esVegana ?? false,
                newSuggestion.Producto.esSinGluten ?? false,
                newSuggestion.Producto.tipo
            );
        } else {
            product = new Drink(
                newSuggestion.Producto.idProducto,
                newSuggestion.Producto.nombre,
                newSuggestion.Producto.descripcion,
                newSuggestion.Producto.estado,
                newSuggestion.Producto.esAlcoholica ?? false
            );
        }

        return new Suggestion(
            product,
            newSuggestion.fechaDesde,
            newSuggestion.fechaHasta
        );
    }

    public async update(data: PartialSchemaSuggestion, idProducto: number, fechaDesde: Date): Promise<Suggestion> {        
        const updatedSuggestion = await prisma.sugerencias.update({
            where: { 
                idProducto_fechaDesde: {
                    idProducto: idProducto,
                    fechaDesde: fechaDesde
                }
            },
            data: { ...data },
            include: {
                Producto: true
            }
        });

        let product: Product;
        if (updatedSuggestion.Producto.tipo !== null && updatedSuggestion.Producto.tipo !== "EMPTY_ENUM_VALUE") {
            product = new Food(
                updatedSuggestion.Producto.idProducto,
                updatedSuggestion.Producto.nombre,
                updatedSuggestion.Producto.descripcion,
                updatedSuggestion.Producto.estado,
                updatedSuggestion.Producto.esVegetariana ?? false,
                updatedSuggestion.Producto.esVegana ?? false,
                updatedSuggestion.Producto.esSinGluten ?? false,
                updatedSuggestion.Producto.tipo
            );
        } else {
            product = new Drink(
                updatedSuggestion.Producto.idProducto,
                updatedSuggestion.Producto.nombre,
                updatedSuggestion.Producto.descripcion,
                updatedSuggestion.Producto.estado,
                updatedSuggestion.Producto.esAlcoholica ?? false
            );
        }
        
        return new Suggestion(
            product,
            updatedSuggestion.fechaDesde,
            updatedSuggestion.fechaHasta
        );
    }    
}