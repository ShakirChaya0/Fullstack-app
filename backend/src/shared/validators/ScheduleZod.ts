import { z } from 'zod';

export const ScheduleSchema = z.object({
  diaSemana: z.number()
    .int()
    .min(0, "El ID debe ser mayor o igual a 0 (Domingo)")
    .max(6, "El ID debe ser menor o igual a 6 (Sabado)"),

  //formato HH:MM
  horaApertura: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido. Use HH:MM (24 horas)"),

  //formato HH:MM
  horaCierre: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido. Use HH:MM (24 horas)")
});

const PartialSchemaSchedule = ScheduleSchema.partial();

export type SchemaSchedule = z.infer<typeof ScheduleSchema>;
export type PartialSchemaSchedule = z.infer<typeof PartialSchemaSchedule>;

export function ValidateSchedule(data: SchemaSchedule) {
    return ScheduleSchema.safeParse(data);
}

export function ValidatePartialSchedule(data: PartialSchemaSchedule) {
    return PartialSchemaSchedule.safeParse(data);
}
