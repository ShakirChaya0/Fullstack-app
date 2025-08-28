import { type BackResults } from "../interfaces/News";
import { useQuery,  } from "@tanstack/react-query";
import { fetchNews } from "../services/fetchNews";

export function useNews (page?: number) {
    const {isLoading, isError, data } = useQuery<BackResults>({
        queryKey: ["News", page],
        queryFn: () => fetchNews(page),
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1
    })
    
    return {isLoading, isError, data}
}