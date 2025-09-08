import { type BackResults } from "../interfaces/Waiters";
import { useQuery } from "@tanstack/react-query";
import fetchWaiters from "../services/fetchWaiters";

export function useWaiters (query: string, page: number) {
    const {isLoading, isError, data } = useQuery<BackResults>({
        queryKey: ["Waiters", page, query],
        queryFn: () => fetchWaiters(page, query),
        staleTime: 1000 * 60 * 60,
    })
    
    return {isLoading, isError, data}
}