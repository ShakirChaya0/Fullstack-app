import { useQuery } from "@tanstack/react-query";
import { getReservations } from "../services/getReservations"; // servicio que trae las reservas

export function useReservation() {
  return useQuery({
    queryKey: ["reservation"],
    queryFn: getReservations,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
