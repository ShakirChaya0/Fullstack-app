import { days } from "../constants/scheduleConstants";


export function getDayLabel(dayIndex: number ): string {
    const day = days.find(d => d.value === dayIndex);
    return day ? day.label : "Día desconocido";
}