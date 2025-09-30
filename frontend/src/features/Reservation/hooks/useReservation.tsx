import { useInfiniteQuery, type QueryFunctionContext } from "@tanstack/react-query";
import GetReservationByClient from "../services/GetReservationByClient";
import type { IReservation } from "../interfaces/IReservation";
import { useApiClient } from "../../../shared/hooks/useApiClient";

interface ReservationPage {
  data: IReservation[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function useReservations(pageSize: number = 4) {
  const { apiCall } = useApiClient();

  return useInfiniteQuery<ReservationPage, Error>({
    queryKey: ["reservations"],
    queryFn: ({ pageParam }: QueryFunctionContext) => {
      const page = (pageParam as number) ?? 1;
      return GetReservationByClient(page, pageSize, apiCall) 
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    initialPageParam: 1,
  });
}
