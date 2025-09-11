import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getScheduleData } from "../../Schedules/shared/sheduleService";
import { sortAndNormalizeSchedules } from "../../Schedules/hooks/useScheduleState";


export default function useAvailableSchedule(selectedDate?: string) {
        const { data: backendSchedules, isLoading: queryLoading, error: queryError } = useQuery({
        queryKey: ['schedules'],
        queryFn: getScheduleData
    });

    const schedules = useMemo(() => {
            return backendSchedules ? sortAndNormalizeSchedules(backendSchedules) : [];
    }, [backendSchedules]);

    const weekday = useMemo(() => {
        if (!selectedDate) return null;
        const [year, month, day] = selectedDate.split("-").map(Number);
        return new Date(year, month - 1, day).getDay();
  }, [selectedDate]);

   // Filtrar y normalizar horarios
  const availableSchedules = useMemo(() => {
    if (!schedules || weekday === null) return [];
    return schedules
      .filter((s) => s.diaSemana === weekday)
  }, [schedules, weekday]);

  return { availableSchedules, queryLoading, queryError , weekday};
}