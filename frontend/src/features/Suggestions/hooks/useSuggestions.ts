import { useQuery,  } from "@tanstack/react-query";
import type { Suggestion } from "../interfaces/Suggestion";
import { getSuggestions } from "../services/getSuggestions";

export function useSuggestions(filter: "ALL" | "Actives"): [ boolean, boolean, Suggestion[] | undefined ] {
    const {isLoading, isError, data } = useQuery<Suggestion[]>({
        queryKey: ["Suggestions", filter],
        queryFn: () => getSuggestions(filter),
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1
    })
    
    return [ isLoading, isError, data ]
}