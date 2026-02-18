import { useQuery } from "@tanstack/react-query";
import type { ITable } from "../interfaces/ITable";
import { useApiClient } from "../../../shared/hooks/useApiClient";
import { getAllTable } from "../services/getAllTable";

export function useWaitersTables(withOrders?: (apiCall: (url: string, options?: RequestInit) => Promise<Response>) => Promise<ITable[]>) {
  const { apiCall } = useApiClient();
  const getFn = withOrders ?? getAllTable 

  return useQuery<ITable[]>({
    queryKey: ["waitersTable"], 
    queryFn: () => getFn(apiCall),
    staleTime: 1000 * 60 * 2, 
    retry: 2, 
  });
}
