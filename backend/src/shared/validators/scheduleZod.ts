import { z } from 'zod';
import { Horarios } from '@prisma/client';

export const ScheduleSchema = z.object({
  diaSemana: z.number()
    .int()
    .min(1, "El ID debe ser mayor o igual a 1 (Lunes)")
    .max(7, "El ID debe ser menor o igual a 7 (Domingo)"),

  //formato HH:MM
  horaApertura: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido. Use HH:MM (24 horas)"),

  //formato HH:MM
  horaCierre: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido. Use HH:MM (24 horas)")
});

//Al no implementarse el checkbox de si la horaCierre es del siguiente día --> Todos los horarios que se ingresan son validos
// export const horarioCorrecto = ScheduleSchema.refine((data) => {
//   // Validar que horaApertura < horaCierre
//   const [horaAp, minAp] = data.horaApertura.split(':').map(Number);
//   const [horaCi, minCi] = data.horaCierre.split(':').map(Number);

//   let sumarDiaCompleto = 0;
//   if(horaCi <= horaAp){ //Se le añede 24 en caso de ser necesario
//     sumarDiaCompleto = 24 * 60;
//   }
  
//   const minutosApertura = horaAp * 60 + minAp;
//   const minutosCierre = horaCi * 60 + minCi + sumarDiaCompleto;
  
//   return minutosApertura < minutosCierre;
// });

export function diaDentroSemana(num: number) {
    if(num < 1 || num > 7){
      return false
    }else
    return true
}

const PartialSchemaSchedule = ScheduleSchema.partial();

export type SchemaSchedule = z.infer<typeof ScheduleSchema>;
export type PartialSchemaSchedule = z.infer<typeof PartialSchemaSchedule>;

export function ValidateSchedule(data: Horarios) {
    return ScheduleSchema.safeParse(data);
}

export function ValidatePartialSchedule(data: Partial<Horarios>) {
    return PartialSchemaSchedule.safeParse(data);
}
