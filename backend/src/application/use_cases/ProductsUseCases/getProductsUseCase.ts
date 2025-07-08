import { Producto } from "@prisma/client";
import { ProductoRepository } from "../../infrastructure/database/repository/productsRepository.js";

export class GetProductsUseCase {
    static async execute(): Promise<Producto[]> {
        return await ProductoRepository.getAll();
    }
}