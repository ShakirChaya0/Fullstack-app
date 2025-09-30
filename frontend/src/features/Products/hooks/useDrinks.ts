import type { Bebida } from "../interfaces/products";
import { useQuery } from "@tanstack/react-query";
import { fetchDrinks } from "../services/fetchDrinks";
import useApiClient from "../../../shared/hooks/useApiClient";

export function useDrinks () {
    const { apiCall } = useApiClient()

    const {isLoading, isError, data} = useQuery<{Drinks: Bebida[]}>({
        queryKey: ["Drinks"],
        queryFn: () => fetchDrinks(apiCall),
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1
    })
    
    return {isLoading, isError, drinks: data?.Drinks}
}