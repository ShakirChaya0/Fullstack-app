import { useInfiniteQuery, type QueryFunctionContext } from "@tanstack/react-query";
import GetReservationByClient from "../services/GetReservationByClient";
import type { IReservation } from "../interfaces/IReservation";
import { useApiClient } from "../../../shared/hooks/useApiClient";
import GetReservationToday from "../services/GetReservationToday";
import type { ReservationType } from "../types/ReservationType";

interface ReservationPage {
  data: IReservation[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

export function useReservations(pageSize: number = 4, type: ReservationType = "today") {
  const { apiCall } = useApiClient();

  return useInfiniteQuery<ReservationPage, Error>({
    queryKey: ["reservations", type],
    queryFn: ({ pageParam }: QueryFunctionContext) => {
      const page = (pageParam as number) ?? 1;

      if(type === "today") return GetReservationToday(page, pageSize, apiCall)

      return GetReservationByClient(page, pageSize, apiCall) 
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    initialPageParam: 1,
  });
}
