import { useMutation, useQueryClient } from "@tanstack/react-query";
import { modifySchedulesToBackend } from "../shared/sheduleService";
import { useNavigate } from "react-router";
import type { useMutationModificationProps } from "../types/scheduleTypes";
import useApiClient from "../../../shared/hooks/useApiClient";

export function useMutationModification ({ schedules, originalSchedule, setError}: useMutationModificationProps ) {
    const queryClient = useQueryClient();
    const { apiCall } = useApiClient()
    const navigate = useNavigate()

    // useMutation para manejar la actualización de horarios (PATCH)
    const modifySchedulesMutation = useMutation({
      mutationFn: () => modifySchedulesToBackend(apiCall, schedules, originalSchedule.current!),
      onSuccess: () => {
        // Invalidar query para refrescar datos del backend
        queryClient.invalidateQueries({ queryKey: ['schedules'] });
        setError(""); // Limpiar errores  
  
        // Redireccionar después de 3 segundos
        setTimeout(() => {
          navigate('/Admin/Horarios');
        }, 2000);
      },
      onError: (err: Error) => {
        setError(`Error al actualizar los horarios: ${err.message}`);
      }
    });

    return { modifySchedulesMutation }
}