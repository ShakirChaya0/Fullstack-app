import { PartialSchemaProductos, SchemaProductos } from "../../shared/validators/ProductZod.js";
import { Product } from "../entities/Product.js";
import { ProductsPaginated } from "../interfaces/ProductsPaginated.interface.js";

export interface IProductoRepository {
    getAll(): Promise<Product[]>;

    getAllPaginated(page: number, limit: number): Promise<ProductsPaginated>

    getByName(nombreProducto: string): Promise<Product[] | null>;

    getByType(tipoProducto: string): Promise<Product[] | null>;

    create(product: SchemaProductos): Promise<Product>;

    update(product: PartialSchemaProductos, productId: number): Promise<Product>;
}