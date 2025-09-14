import type { ProductPriceWithoutID } from "../interfaces/product&PriceInterfaces"
import type { ProductType } from "../types/product&PriceTypes"

export function isValidProduct( product: ProductPriceWithoutID, productType: ProductType | undefined) {
    if(product.nombre && product.descripcion && product.precio && product.estado && productType && 
        (productType === 'Comida' ? product.tipo !== undefined : true)) return true
    return false
}