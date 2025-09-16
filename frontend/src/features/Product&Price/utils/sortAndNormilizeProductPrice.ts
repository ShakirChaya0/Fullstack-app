import type { ProductPriceFromBackendPaginated, ProductPricePaginated } from "../interfaces/product&PriceInterfaces";

export function sortAndNormalizeProductPrice (productsPrice: ProductPriceFromBackendPaginated | undefined): ProductPricePaginated {
    // Función para ordenar y normalizar productos y precios del backend

    // Evaluamos que sea realmente un array
    if (!productsPrice || !Array.isArray(productsPrice.data)) {
        return {
            productos: [],
            paginacion: {
                paginaActual: 1,
                paginaTotales: 0,
                itemsTotales: 0,
                itemsPorPagina: 0,
                proxPagina: false,
                antePagina: false
            }
        };
    }
    
    return {
        productos: productsPrice.data.map(oneProductPrice => ({
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
        })),
        paginacion: {
            paginaActual: productsPrice.pagination.currentPage,
            paginaTotales: productsPrice.pagination.totalPages,
            itemsTotales: productsPrice.pagination.totalItems,
            itemsPorPagina: productsPrice.pagination.ItemsPerPage,
            proxPagina: productsPrice.pagination.hasNextPage,
            antePagina: productsPrice.pagination.hasPreviousPage
        }
    }
    
}