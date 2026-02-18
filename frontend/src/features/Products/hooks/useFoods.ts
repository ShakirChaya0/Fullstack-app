import type { Comida } from "../interfaces/products";
import { useQuery } from "@tanstack/react-query";
import { fetchFoods } from "../services/fetchFoods";
import useApiClient from "../../../shared/hooks/useApiClient";

export function useFoods () {
    const { apiCall } = useApiClient()

    const {isLoading, isError, data} = useQuery<{Foods: Comida[]}>({
        queryKey: ["Foods"],
        queryFn: () => fetchFoods(apiCall),
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1
    })
    return {isLoading, isError, foods: data?.Foods}
}