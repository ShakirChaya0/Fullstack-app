import { useInfiniteQuery  } from "@tanstack/react-query";
import type { Suggestion } from "../interfaces/Suggestion";
import { getSuggestions } from "../services/getSuggestions";
import type { SuggFilters, SuggSortBy } from "../types/SuggSharedTypes";
import { useApiClient } from "../../../shared/hooks/useApiClient";

export function useSuggestions(filter: SuggFilters, sortBy: SuggSortBy) {
  const { apiCall } = useApiClient();

  return useInfiniteQuery<Suggestion[]>({
    queryKey: ["suggestions", filter, sortBy],
    queryFn: ({ pageParam = 1 }) => getSuggestions(filter, sortBy, pageParam, apiCall),
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < 15) return undefined;
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });
}