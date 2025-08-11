import { SchemaPrice } from "../../shared/validators/Fix_priceZod.js";
import { Price } from "../entities/Price.js";
import { Product } from "../entities/Product.js";

export interface IPriceRepository {
    getAll(): Promise<Price[]>;

    getByProduct(product: Product): Promise<Price[]>;

    getOne(productId: number, dateFrom: Date): Promise<Price | null>;

    getActual(product: Product): Promise<Price | null>;

    create(price: SchemaPrice): Promise<Price>;

    delete(productId: number, dateFrom: Date): Promise<void>;
}