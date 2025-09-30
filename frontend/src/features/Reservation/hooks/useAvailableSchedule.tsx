import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getScheduleData } from "../../Schedules/shared/sheduleService";
import { sortAndNormalizeSchedules } from "../../Schedules/hooks/useScheduleState";
import { useApiClient } from "../../../shared/hooks/useApiClient";

function parseLocalDateFromInput(value?: string): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day); 
}

export default function useAvailableSchedule(selectedDate?: string) {
  const { apiCall } = useApiClient();
  const { data: backendSchedules, isLoading: queryLoading, error: queryError } = useQuery({
    queryKey: ['schedules'],
    queryFn: () => getScheduleData(apiCall)
  });

  const schedules = useMemo(() => {
    return backendSchedules ? sortAndNormalizeSchedules(backendSchedules) : [];
  }, [backendSchedules]);

  const weekday = useMemo(() => {
    if (!selectedDate) return null;
    const d = parseLocalDateFromInput(selectedDate)!;
    return d.getDay(); // 0 = domingo ... 6 = sábado
  }, [selectedDate]);

  // Filtrar y normalizar horarios
  const availableSchedules = useMemo(() => {
    if (!schedules || weekday === null) return [];
    return schedules
      .filter((s) => s.diaSemana === weekday)
  }, [schedules, weekday]);

  return { availableSchedules, queryLoading, queryError , weekday};
}