import { Producto } from "@prisma/client";
import { ProductoRepository } from "../../infrastructure/database/repository/productsRepository.js";

export class getProductByTypeUseCase {
    static async execute(tipoProducto: string): Promise<Producto[] | null> {
        return await ProductoRepository.getByType(tipoProducto);
    }
}