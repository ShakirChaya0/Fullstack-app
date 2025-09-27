import type { BackendSchedule } from "../types/scheduleTypes";
import { getDayLabel } from "./getDayLabel";


export function incompleteDays (schedules: BackendSchedule[]) {
    const incompleteDays = schedules
        .filter(oneSchedule => !oneSchedule.horaApertura || !oneSchedule.horaCierre)
        .map(oneSchedule => getDayLabel(oneSchedule.diaSemana))
    
    return incompleteDays.join(' - ')
}