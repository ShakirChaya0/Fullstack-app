import { useQuery } from "@tanstack/react-query";
import { getProductsData } from "../services/product&PriceService";
import { useMemo, useState } from "react";
import { sortAndNormalizeProductPrice } from "../utils/sortAndNormilizeProductPrice";

export const useProductsWithFilters = () => {
    const { data: backendProducts, isLoading, error } = useQuery({
        queryKey: ['products'],
        queryFn: getProductsData
    });

    // Se guarda los resultados normalizados o un array vacio en consecuencia
    const productsPrice = useMemo(() => {
        return backendProducts ? sortAndNormalizeProductPrice(backendProducts) : []
    }, [backendProducts])

    const [filters, setFilters] = useState({
        search: '',           // Para buscar por nombre o ID
        type: 'Todos',         // 'Todos', 'Comida', 'Bebida'
        state: 'Todos'         // 'Todos', 'Disponible', 'No_Disponible'
    });

    const filteredProducts = useMemo(() => {
        if (!productsPrice) return [];
        
        return productsPrice.filter(product => {
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

    //Para actualizar filtros
    const updateFilter = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    //Para limpiar filtros
    const clearFilters = () => {
        setFilters({ search: '', type: 'Todos', state: 'Todos' });
    };

    return {
        allProducts: productsPrice || [],
        filteredProducts,
        isLoading,
        error,
        filters,
        updateFilter,
        clearFilters
    };
};