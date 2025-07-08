import { Producto } from "@prisma/client";
import { ProductoRepository } from "../../infrastructure/database/repository/productsRepository.js";

export class GetProductByIdUseCase {
    static async execute(idProducto: number): Promise<Producto | null> {
        return await ProductoRepository.getById(idProducto);
    }
}