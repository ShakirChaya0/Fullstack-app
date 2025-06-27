import { Producto } from "@prisma/client";
import { ProductoRepository } from "../../infrastructure/database/repository/productsRepository.js";

export class GetProductByNameUseCase {
    static async execute(nombreProducto: string): Promise<Producto[] | null> {
        return await ProductoRepository.getByName(nombreProducto);
    }
}