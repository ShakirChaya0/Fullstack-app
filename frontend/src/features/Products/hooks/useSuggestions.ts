import { useQuery } from "@tanstack/react-query";
import fetchSuggestions from "../services/fetchSuggestions";
import type { Suggestion } from "../../Suggestions/interfaces/Suggestion";

export function useSuggestions () {
    const {isLoading, isError, data} = useQuery<Suggestion[]>({
        queryKey: ["Suggestions"],
        queryFn: fetchSuggestions,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1
    })
    return {isLoading, isError, data}
}