import type { Comida } from "../interfaces/products";
import { useQuery } from "@tanstack/react-query";
import { fetchFoods } from "../services/fetchFoods";

export function useFoods () {
    const {isLoading, isError, data} = useQuery<{Foods: Comida[]}>({
        queryKey: ["Foods"],
        queryFn: fetchFoods,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
    
    return {isLoading, isError, foods: data?.Foods}
}