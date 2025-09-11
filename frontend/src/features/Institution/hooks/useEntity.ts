import { useQuery } from "@tanstack/react-query";
import type Information from "../interfaces/Information";
import type Policy from "../interfaces/Policy";
import type { EntityState } from "../pages/Institution";


export default function useEntity<T extends Policy | Information>(
  entity: EntityState,
  fetchFn: () => Promise<T>
): [boolean, boolean, T | undefined] {
  const { isLoading, isError, data } = useQuery<T>({
    queryKey: [entity],
    queryFn: fetchFn,
    staleTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });

  return [isError, isLoading, data];
}
