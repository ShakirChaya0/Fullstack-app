import { type BackResults } from "../interfaces/Waiters";
import { useQuery } from "@tanstack/react-query";
import fetchWaiters from "../services/fetchWaiters";
import useApiClient from "../../../shared/hooks/useApiClient";

export function useWaiters (query: string, page: number) {
    const { apiCall } = useApiClient()

    const {isLoading, isError, data } = useQuery<BackResults>({
        queryKey: ["Waiters", page, query],
        queryFn: () => fetchWaiters(apiCall, page, query),
        staleTime: 1000 * 60 * 60,
    })
    
    return {isLoading, isError, data}
}