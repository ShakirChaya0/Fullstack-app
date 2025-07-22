import z from "zod";
import { ValidationError } from "../exceptions/ValidationError.js";

const ReservationSchema = z.object({
  fechaReserva: z.string()    
    .refine(str => /^\d{2}\/\d{2}\/\d{4}$/.test(str), {
        message: "Formato inválido. Usa dd/mm/yyyy",
    })
    .transform(str => {
        const [day, month, year] = str.split("/").map(Number);
        return new Date(year, month - 1, day);
    })
    .refine(date => !isNaN(date.getTime()), {
        message: "Fecha inválida",
    })
    .refine(date => date >= new Date(new Date().setHours(0,0,0,0)), {
        message: "La fecha de la reserva no puede ser en el pasado",
    }),

  horarioReserva: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido. Use HH:MM (24 horas)")
    .refine(time => {
        const [hour] = time.split(":").map(Number);
        return hour >= 9 && hour <= 23; // Horario permitido: 09:00 - 23:59
    }, {
        message: "La hora debe estar entre 09:00 y 23:59",
    }),

  fechaCancelacion: z.string()
    .refine(str => /^\d{2}\/\d{2}\/\d{4}$/.test(str), {
        message: "Formato inválido. Usa dd/mm/yyyy",
    })
    .transform(str => {
        const [day, month, year] = str.split("/").map(Number);
        return new Date(year, month - 1, day);
    })
    .refine(date => !isNaN(date.getTime()), {
        message: "Fecha inválida",
    })
    .optional(),

  cantidadComensales: z.number()
    .int("Debe ser un número entero")
    .min(1, "El número de comensales debe ser al menos 1")
    .max(50, "El número de comensales no puede superar 50"),

  estado: z.enum(["Realizada", "Asistida", "No_Asistida", "Cancelada"])
});

export type SchemaReservation = z.infer<typeof ReservationSchema>;

export function validateReservation(data: Partial<SchemaReservation>) {
  const result = ReservationSchema.safeParse(data);
    if(!result.success) {
            throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
        }
  return result.data;
}

export const PartialReservationSchema = ReservationSchema.partial();

export type PartialSchemaReservation = z.infer<typeof PartialReservationSchema>;

export function validatePartialReservation(data: Partial<SchemaReservation>) {
  const result = PartialReservationSchema.safeParse(data);
    if(!result.success) {
            throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
        }
  return result.data;
}
