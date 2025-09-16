import { useQuery } from "@tanstack/react-query";
import { getProductsData } from "../services/product&PriceService";
import { useMemo, useState } from "react";
import { sortAndNormalizeProductPrice } from "../utils/sortAndNormilizeProductPrice";

export const useProductsWithFilters = (initialPage = 1, initialLimit = 6) => {
    const [page, setPage] = useState(initialPage)
    const [limit, setLimit] = useState(initialLimit)
    
    const { data: backendProducts, isLoading, error } = useQuery({
        queryKey: ['products', page, limit],
        queryFn: () => getProductsData(page, limit),
        staleTime: 5 * 60 * 1000, // Los datos son válidos por 5 minutos
        gcTime: 10 * 60 * 1000, // Cache se mantiene 10 minutos (antes cacheTime)
    });

    // Se guarda los resultados normalizados o un json con respuesta de la paginación vacio en consecuencia
    const productsPrice = useMemo(() => {
        return backendProducts ? sortAndNormalizeProductPrice(backendProducts) 
        : 
        { 
            productos: [],
            paginacion: {
                paginaActual: 1,
                paginaTotales: 0,
                itemsTotales: 0,
                itemsPorPagina: 0,
                proxPagina: false,
                antePagina: false
            }
        }
    }, [backendProducts])

    const [filters, setFilters] = useState({
        search: '',           // Para buscar por nombre o ID
        type: 'Todos',         // 'Todos', 'Comida', 'Bebida'
        state: 'Todos'         // 'Todos', 'Disponible', 'No_Disponible'
    });

    const filteredProducts = useMemo(() => {
        if (!productsPrice.productos) return [];
        
        return productsPrice.productos.filter(product => {
            //Filtros por Nombre y ID
            const searchMatch = filters.search === '' || 
            product.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
            product.idProducto.toString().includes(filters.search) ||
            (filters.search.indexOf("-") !== -1 && filters.search.indexOf("-") === filters.search.lastIndexOf("-") //Me determina que solo exite un solo caracter "-"
            && filters.search.toLowerCase().includes(product.idProducto.toString()) &&  
            filters.search.toLowerCase().includes(product.nombre.toLowerCase())); 

            //Filtros por Tipo de Producto
            const typeMatch = filters.type === 'Todos' ||
            (filters.type === 'Comida' && product.tipo) ||
            (filters.type === 'Bebida' && product.esAlcoholica !== undefined);

            //Filtros por disponibilidad de producto
            const stateMatch = filters.state === 'Todos' ||
            (filters.state === 'Disponible' && product.estado === 'Disponible') ||
            (filters.state === 'No_Disponible' && product.estado === 'No_Disponible');

            //Devuelvo la combinación de Todos
            return searchMatch && typeMatch && stateMatch;
        });

    }, [productsPrice, filters]);

    // Funciones propias de la navegación
    const nextPage = () => {
        if (productsPrice.paginacion.proxPagina) setPage(prev => prev + 1)
    }

    const previousPage = () => {
        if (productsPrice.paginacion.antePagina) setPage(prev => prev - 1)
    }

    const goToPage = (newPage: number) => {
        const maxPage = productsPrice.paginacion.paginaTotales | 1
        if(newPage <= maxPage && newPage >= 1) setPage(newPage)
    }

    const changeLimit = (newLimit: number) => {
        setLimit(newLimit)
        setPage(1) // Reseteamos a la primera página
    }

    //Para actualizar filtros
    const updateFilter = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPage(1) // Reseteamos a la primera página al filtrar
    };

    //Para limpiar filtros
    const clearFilters = () => {
        setFilters({ search: '', type: 'Todos', state: 'Todos' })
        setPage(1)
    };

    return {
        // Datos
        allProducts: productsPrice.productos || [],
        pagination: productsPrice.paginacion,
        filteredProducts,
        // Estados
        isLoading,
        error,
        filters,
        // Filtros
        updateFilter,
        clearFilters,
        // Paginación
        nextPage,
        previousPage,
        goToPage,
        changeLimit
    };
};