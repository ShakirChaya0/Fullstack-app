import { useQuery } from "@tanstack/react-query";
import { getProductsData } from "../services/product&PriceService";
import { useMemo, useState } from "react";
import { sortAndNormalizeProductPrice } from "../utils/sortAndNormilizeProductPrice";
import useApiClient from "../../../shared/hooks/useApiClient";

export const useProductsWithFilters = (initialPage = 1, initialLimit = 27) => {
    const { apiCall } = useApiClient();   
    const [page, setPage] = useState(initialPage)
    const [limit, setLimit] = useState(initialLimit)
    const [filters, setFilters] = useState({
        search: '',                  // Para buscar por nombre o ID
        type: 'Todos',               // 'Todos', 'Comida', 'Bebida'
        state: 'Todos',              // 'Todos', 'Disponible', 'No_Disponible'
        foodType: 'Todos',           // 'Todos', 'Entrada', 'Plato Principal', 'Postre'
        foodSpecification: 'Todos',  // 'Todos', 'Sin Gluten', 'Vegetariana', 'Vegana'
        drinkSpecification: 'Todos' // 'Todos', 'Sin alcohol', 'Alcóholica'
    })
    
    const { data: backendProducts, isLoading, error } = useQuery({
        queryKey: ['products', page, limit, filters.search],
        queryFn: () => getProductsData(apiCall, page, limit, filters.search),
        staleTime: 5 * 60 * 1000, // Los datos son válidos por 5 minutos
        gcTime: 10 * 60 * 1000, // Cache se mantiene 10 minutos (antes cacheTime)
        retry: (failureCount, error) => {
        // Debido a que la busqueda por el endpoint de id devuelve un 404 para aquellos que no se encuentran en la BD, se setea el isLoading como false automaticamente para esas situaciones.
        if (error?.name === 'NotFoundError') return false;
        return failureCount < 3;
    },
    })

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

    const filteredProducts = useMemo(() => {
        if (!productsPrice.productos) return [];
        
        return productsPrice.productos.filter(product => {
            //Filtros por Nombre y ID
            const typeSearch = filters.search === '' || 
            product.nombre.toLowerCase().includes(filters.search.toLowerCase().trim()) ||
            product.idProducto.toString().includes(filters.search.trim())

            //Filtros por Tipo de Producto
            const typeMatch = filters.type === 'Todos' ||
            (filters.type === 'Comida' && product.tipo) ||
            (filters.type === 'Bebida' && product.esAlcoholica !== undefined);

            //Filtros por disponibilidad de producto
            const stateMatch = filters.state === 'Todos' ||
            (filters.state === 'Disponible' && product.estado === 'Disponible') ||
            (filters.state === 'No_Disponible' && product.estado === 'No_Disponible');

            //Filtros por tipo de comida
            const typeFood = filters.foodType === 'Todos' ||
            (filters.foodType === 'Entrada' && product.tipo === 'Entrada') ||
            (filters.foodType === 'Plato principal' && product.tipo === 'Plato_Principal') ||
            (filters.foodType === 'Postre' && product.tipo === 'Postre')

            //Filtros por especificaciones de una Comida
            const typeFoodSpecification = filters.foodSpecification === 'Todos' ||
            (filters.foodSpecification === 'Sin Gluten' && product.esSinGluten) ||
            (filters.foodSpecification === 'Vegatariana' && product.esVegetariana) ||
            (filters.foodSpecification === 'Vegana' && product.esVegana)

            //Filtros por especificaciones de una Bebida
            const typeDrinkSpecification = filters.drinkSpecification === 'Todos' ||
            (filters.drinkSpecification === 'Sin alcohol' && product.esAlcoholica == false) ||
            (filters.drinkSpecification === 'Alcoholica' && product.esAlcoholica) 

            //Devuelvo la combinación de Todos
            return typeSearch && typeMatch && stateMatch && typeFood && typeFoodSpecification && typeDrinkSpecification;
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
        setFilters({ search: '', type: 'Todos', state: 'Todos', foodType: 'Todos', foodSpecification: 'Todos', drinkSpecification: 'Todos'})
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