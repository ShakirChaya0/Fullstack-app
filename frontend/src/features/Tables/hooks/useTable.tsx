import { useQuery } from "@tanstack/react-query";
import type { ITable } from "../interfaces/ITable";
import { useApiClient } from "../../../shared/hooks/useApiClient";
import { getAllTable } from "../services/getAllTable";

export function useTables() {
  const { apiCall } = useApiClient();

  return useQuery<ITable[], Error>({
    queryKey: ["tables"], 
    queryFn: () => getAllTable(apiCall),
    staleTime: 1000 * 60 * 2, 
    retry: 2, 
  });
}
