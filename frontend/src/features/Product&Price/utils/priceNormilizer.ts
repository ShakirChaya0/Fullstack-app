import type { PriceFromBackend } from "../interfaces/product&PriceInterfaces";

export function priceNormilizer(prices: PriceFromBackend[]) {
    return prices.map(price => ({
        producto: {
            idProducto: price._product._productId,
            nombre: price._product._name,
            descripcion: price._product._description,
            estado: price._product._state,
            precio: price._product._price,
            esSinGluten: price._product._isGlutenFree,
            esVegetariana: price._product._isVegetarian,
            esVegana: price._product._isVegan,
            esAlcoholica: price._product._isAlcoholic
        },
        fechaVigencia: price._dateFrom,
        monto: price._amount
    }))
    .sort((a, b) => new Date(b.fechaVigencia).getTime() - new Date(a.fechaVigencia).getTime()); 
}