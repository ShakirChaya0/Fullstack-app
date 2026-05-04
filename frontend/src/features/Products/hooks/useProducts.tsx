import type { Bebida, Comida } from "../interfaces/products";
import { useQuery } from "@tanstack/react-query";
import useApiClient from "../../../shared/hooks/useApiClient";
import fetchProducts from "../services/fetchProducts";

export function useProducts () {
    const { apiCall } = useApiClient()

    const {isLoading, isError, data: dataAux} = useQuery<(Comida | Bebida)[]>({
        queryKey: ["Products"],
        queryFn: () => fetchProducts(apiCall),
        staleTime: Infinity,
        retry: 1
    })

    const data = dataAux?.filter((products) => products._state === 'Disponible');

    return {isLoading, isError, data}
}