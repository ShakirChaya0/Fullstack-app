import type { ProductsInterface } from "../../Products/interfaces/products";

export interface Suggestion {
    _product: ProductsInterface,
    _dateFrom: Date,
    _dateTo: Date
}