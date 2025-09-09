import type { BackendSchedule } from "../types/scheduleTypes";


export function completeSchedule (schedules: BackendSchedule[]) {
    // Validar todos los horarios completados
    let validSchedule = true
    schedules.forEach(oneSchedule => {
        if(!oneSchedule.horaApertura || !oneSchedule.horaCierre) validSchedule = false
    });

    return validSchedule
}