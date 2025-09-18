import { useQuery } from "@tanstack/react-query";
import GetReservationByClient from "../services/GetReservationByClient";

export function useReservation() {
  return useQuery({
    queryKey: ["reservation"],
    queryFn: GetReservationByClient,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
