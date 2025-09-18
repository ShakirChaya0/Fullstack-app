import { useMutation, useQueryClient} from "@tanstack/react-query";
import { toast } from "react-toastify";
import CreateReservation  from "../services/CreateReservation";
import type { IReservation, StateReservation } from "../interfaces/IReservation";
import UpdateReservation from "../services/UpdateReservation";

interface ReservationPayLoad {
    _reservationId?: number,
    _reserveDate: Date, 
    _reserveTime: string,
    _commensalsNumber: number,
    _status?: StateReservation,
}

interface UseResMutationnParams {
    handleError: (message: string | null) => void;
    reservation?: IReservation;
}

export default function useReservationMutation ({handleError, reservation}: UseResMutationnParams) {
    const queryClient = useQueryClient()
    
        return useMutation<IReservation, Error, ReservationPayLoad>({
            mutationFn: (data: ReservationPayLoad) => {
                if (data._status && data._reservationId) {
                    return UpdateReservation({
                        _reservationId: data._reservationId, 
                        _status: data._status, 
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
                //no se ve el modificar y si el crear
                await queryClient.invalidateQueries({ queryKey: ["reservation"] });
                toast.success(`Se ${reservation?._status ? "modificó" : "creó"} la reserva con exito`)
                handleError(null);
            },
            onError: (err) => {
                toast.error(`Error al ${reservation ? "modificar" : "crear"} la reserva`);
                if (err instanceof Error) handleError(err.message);
                console.log(err)
        }
    });
}