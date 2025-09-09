import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CreateReservation  from "../services/CreateReservation";
import type { IReservation } from "../interfaces/IReservation";
import UpdateReservation from "../services/UpdateReservation";

interface ReservationPayLoad {
    _reserveDate : Date, 
    _reserveTime : string,
    _commensalsNumber: number
}

interface UseResMutationnParams {
    handleClose: () => void;
    handleError: (message: string | null) => void;
    reservation: IReservation | undefined;
}

export default function useReservationMutation ({handleError, handleClose, reservation}: UseResMutationnParams) {
    const queryClient = useQueryClient()
    
        return useMutation<IReservation, Error, ReservationPayLoad>({
            mutationFn: (data: ReservationPayLoad) => {
                if (reservation) {
                    return UpdateReservation({
                        _reservationId: reservation._reserveId, 
                        _status: reservation._status, 
                        _reserveDate: data._reserveDate, 
                        _reserveTime: data._reserveTime, 
                        _commensalsNumber: data._commensalsNumber
                    });
                } else {
                    return CreateReservation({
                        _reserveDate: data._reserveDate, 
                        _reserveTime: data._reserveTime, 
                        _commensalsNumber: data._commensalsNumber
                    });
                }
            },
            
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: ["suggestions"] });
                toast.success(`Se ${reservation ? "modificó" : "creó"} la reserva con exito`)
                handleError(null);
                handleClose();
            },
            onError: (err) => {
                toast.error(`Error al ${reservation ? "modificar" : "crear"} la reserva`);
                if (err instanceof Error) handleError(err.message);
                console.log(err)
        }
    });
}