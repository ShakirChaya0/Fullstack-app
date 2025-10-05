import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CreateReservation from "../services/CreateReservation";
import UpdateReservation from "../services/UpdateReservation";
import type { IReservation, StateReservation } from "../interfaces/IReservation";
import { useApiClient } from "../../../shared/hooks/useApiClient";

interface ReservationPayLoad {
  _reservationId?: number;
  _reserveDate: Date;
  _reserveTime: string;
  _commensalsNumber: number;
  _status?: StateReservation;
}

interface UseResMutationParams {
  handleError: (message: string | null) => void;
}

export default function useReservationMutation({ handleError }: UseResMutationParams) {
  const queryClient = useQueryClient();
  const { apiCall } = useApiClient();

  return useMutation<IReservation, Error, ReservationPayLoad>({
    mutationFn: (data: ReservationPayLoad) => {
      if (data._status && data._reservationId) {
        return UpdateReservation({
          _reservationId: data._reservationId,
          _status: data._status,
          _reserveDate: data._reserveDate,
          _reserveTime: data._reserveTime,
          _commensalsNumber: data._commensalsNumber,
        }, apiCall);
      } else {
        return CreateReservation({
          _reserveDate: data._reserveDate,
          _reserveTime: data._reserveTime,
          _commensalsNumber: data._commensalsNumber,
        }, apiCall);
      }
    },

    onSuccess: async (_data, variables) => {
      // Invalida y refetch de todas las reservas activas
      await queryClient.refetchQueries({ queryKey: ["reservations"], type: "active" });

      if (variables._status === "Cancelada") {
        toast.success("La reserva se canceló exitosamente");
      } else if (variables._status === "Asistida") {
        toast.success("La reserva fue marcada como Asistida");
      } else if (variables._status === "No_Asistida") {
        toast.success("La reserva fue marcada como No Asistida");
      } else {
        toast.success("Se creó la reserva con éxito");
      }

      handleError(null);
    },

    onError: (err) => {
      toast.error("Ocurrió un error al procesar la reserva");
      if (err instanceof Error) handleError(err.message);
      console.log(err);
    },
  });
}
