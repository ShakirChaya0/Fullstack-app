import { useQuery } from "@tanstack/react-query";
import fetchSuggestions from "../services/fetchSuggestions";
import type { Bebida, Comida } from "../interfaces/products";

export type BackSuggestion = {
    _dateFrom: string,
    _dateTo: string,
    _product: Comida | Bebida

}

export function useSuggestions () {
    const {isLoading, isError, data} = useQuery<BackSuggestion[]>({
        queryKey: ["Suggestions"],
        queryFn: fetchSuggestions,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1
    })
    return {isLoading, isError, data}
}