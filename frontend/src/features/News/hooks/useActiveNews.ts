import { useQuery,  } from "@tanstack/react-query";
import useApiClient from "../../../shared/hooks/useApiClient";
import activeNews from "../services/activeNews";
import type News from "../interfaces/News";

export function useActiveNews () {
    const { apiCall } = useApiClient()

    const {isLoading, isError, data } = useQuery<News[]>({
        queryKey: ["News"],
        queryFn: () => activeNews(apiCall),
        staleTime: 1000 * 60 * 60,
        retry: 0
    })
    
    return { isLoading, isError, data }
}