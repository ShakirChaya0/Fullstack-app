import { ISuggestionRepository } from "../../../domain/repositories/ISuggestionRepository.js";
import { Suggestion } from "../../../domain/entities/Suggestion.js";
import { Drink, Food, Product } from "../../../domain/entities/Product.js";
import { PrismaClient } from "@prisma/client";
import { PartialSchemaSuggestion, SchemaSuggestion } from "../../../shared/validators/suggestionZod.js";

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

    public async create(data: SchemaSuggestion): Promise<Suggestion> {
        const newSuggestion = await prisma.sugerencias.create({
            data: {
                fechaDesde: data.fechaDesde,
                fechaHasta: data.fechaHasta,
                idProducto: data.idProducto
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

    public async update(data: PartialSchemaSuggestion, idSugerencia: number): Promise<Suggestion> {        
        const updatedSuggestion = await prisma.sugerencias.update({
            where: { 
                idSugerencia: idSugerencia
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