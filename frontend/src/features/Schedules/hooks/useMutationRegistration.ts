import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveSchedulesToBackend } from "../shared/sheduleService";
import { useNavigate } from "react-router";
import type { useMutationRegistrationProps } from "../types/scheduleTypes";
import useApiClient from "../../../shared/hooks/useApiClient";

export function useMutationRegistration ({ schedules, setError}: useMutationRegistrationProps ) {
    const queryClient = useQueryClient();
    const { apiCall } = useApiClient()
    const navigate = useNavigate()
    
  // useMutation para manejar la actualización de horarios (POST)
  const saveSchedulesMutation = useMutation({
    mutationFn: () => saveSchedulesToBackend(apiCall, schedules),
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
      setError(`Error al registrar los horarios: ${err.message}`);
    }
  });

    return { saveSchedulesMutation }
}