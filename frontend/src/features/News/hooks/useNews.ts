import { type BackResults } from "../interfaces/News";
import { useQuery } from "@tanstack/react-query";
import { fetchNews } from "../services/fetchNews";
import { useNewsActions } from "./useNewsActions"

export function useNews (page: number) {
    const { handleSetNews } = useNewsActions()
    const {isLoading, isError, data} = useQuery<BackResults>({
        queryKey: ["News", page],
        queryFn: () => fetchNews(page),
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: 1
    })

    if (data) {
      handleSetNews(data) 
    }
    
    return {isLoading, isError, pages: data?.pages, totalItems: data?.totalItems}
}