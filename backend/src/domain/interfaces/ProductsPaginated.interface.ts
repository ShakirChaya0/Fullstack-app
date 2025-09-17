import { Product } from "../entities/Product.js";

export interface ProductsPaginated{ 
    readonly products: Product[],
    readonly totalItems: number,
    readonly totalPages: number,
    readonly currentPage: number,
    readonly hasNextPage: boolean,
    readonly hasPreviousPage: boolean
}