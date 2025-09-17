import type { ProductPriceWithoutID, ProductWithoutPrice } from "../interfaces/product&PriceInterfaces"
import type { ProductType } from "../types/product&PriceTypes"

export function isValidProduct( product: ProductPriceWithoutID | ProductWithoutPrice, productType: ProductType | undefined) {
    if(product.nombre && product.descripcion && product.estado && productType && 
        (productType === 'Comida' ? product.tipo !== undefined : true)) return true
    return false
}
