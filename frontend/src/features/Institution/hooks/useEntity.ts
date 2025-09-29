import { useQuery } from "@tanstack/react-query";
import type Information from "../interfaces/Information";
import type Policy from "../interfaces/Policy";
import type { EntityState } from "../pages/Institution";
import useApiClient from "../../../shared/hooks/useApiClient";

export default function useEntity<T extends Policy | Information>(
  entity: EntityState,
  fetchFn: (apiCall: (url: string, options?: RequestInit) => Promise<Response>) => Promise<T>
): [boolean, boolean, T | undefined] {
  const { apiCall } = useApiClient();
  const { isLoading, isError, data } = useQuery<T>({
    queryKey: [entity],
    queryFn: () => fetchFn(apiCall),
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  return [isError, isLoading, data];
}
