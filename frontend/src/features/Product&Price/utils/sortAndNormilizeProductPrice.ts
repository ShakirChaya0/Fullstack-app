import type { ProductPrice, ProductPriceFromBackend } from "../interfaces/product&PriceInterfaces";

export function sortAndNormalizeProductPrice (productsPrice: ProductPriceFromBackend[] | undefined): ProductPrice[] {
    // Función para ordenar y normalizar productos y precios del backend

    // Evaluamos que sea realmente un array
    if (!productsPrice || !Array.isArray(productsPrice)) {
        return [];
    }
    
    return productsPrice.map(oneProductPrice => ({
        idProducto: oneProductPrice._productId,
        nombre: oneProductPrice._name,
        descripcion: oneProductPrice._description,
        estado: oneProductPrice._state,
        precio: oneProductPrice._price,
        esSinGluten: oneProductPrice?._isGlutenFree,
        esVegetariana: oneProductPrice?._isVegetarian,
        esVegana: oneProductPrice?._isVegan,
        tipo: oneProductPrice?._type,
        esAlcoholica: oneProductPrice?._isAlcoholic
    }));
}