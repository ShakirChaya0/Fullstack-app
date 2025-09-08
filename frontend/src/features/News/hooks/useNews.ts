import { type BackResults } from "../interfaces/News";
import { useQuery,  } from "@tanstack/react-query";
import { fetchNews } from "../services/fetchNews";
import type { FilterProps } from "../pages/NewsCRUD";

export function useNews (query: string, filter: FilterProps, page?: number) {
    const {isLoading, isError, data } = useQuery<BackResults>({
        queryKey: ["News", page, query, filter],
        queryFn: () => fetchNews(query, filter, page),
        staleTime: 1000 * 60 * 60,
    })
    
    return {isLoading, isError, data}
}