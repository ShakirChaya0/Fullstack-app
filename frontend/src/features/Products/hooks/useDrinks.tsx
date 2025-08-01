import type { Bebida } from "../interfaces/products";
import { useQuery } from "@tanstack/react-query";
import { fetchDrinks } from "../services/fetchDrinks";

export function useDrinks () {
    const {isLoading, isError, data} = useQuery<{Drinks: Bebida[]}>({
        queryKey: ["Drinks"],
        queryFn: fetchDrinks,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
    
    return {isLoading, isError, drinks: data?.Drinks}
}