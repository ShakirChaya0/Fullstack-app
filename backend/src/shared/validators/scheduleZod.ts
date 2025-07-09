import { z } from 'zod';
import { Horarios } from '@prisma/client';

export const ScheduleSchema = z.object({
  idHorario: z.number()
    .int()
    .min(1, "El ID debe ser mayor o igual a 1 (Lunes)")
    .max(7, "El ID debe ser menor o igual a 7 (Domingo)"),

  //formato HH:MM
  horaApertura: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido. Use HH:MM (24 horas)"),

  //formato HH:MM
  horaCierre: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido. Use HH:MM (24 horas)")
})

const PartialSchemaSchedule = ScheduleSchema.partial();

export type SchemaSchedule = z.infer<typeof ScheduleSchema>;
export type PartialSchemaSchedule = z.infer<typeof PartialSchemaSchedule>;

export function ValidateSchedule(data: Horarios) {
    return ScheduleSchema.safeParse(data);
}

export function ValidatePartialSchedule(data: Partial<Horarios>) {
    return PartialSchemaSchedule.safeParse(data);
}
