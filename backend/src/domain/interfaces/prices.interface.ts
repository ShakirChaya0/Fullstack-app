import { Product } from "../entities/Product.js";

export interface PriceInterface {
    readonly product: Product;
    readonly dateFrom: Date;
    amount: number;
}