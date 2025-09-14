import type { ProductPrice } from "../interfaces/product&PriceInterfaces"

export function isValidNameProduct(newProductName: string, products: ProductPrice[]  ) {
    const index = products.findIndex( product => product.nombre.toLowerCase() === newProductName)
    if (index === -1) return true
    return false
}