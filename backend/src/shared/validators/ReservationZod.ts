import z from "zod";
import { ValidationError } from "../exceptions/ValidationError.js";

export const ReservationSchema = z.object({
  reserveDate: z.preprocess((val) => {
      if (typeof val === "string" || val instanceof Date) return new Date(val);
  }, z.date().refine(date => date >= new Date(new Date().setHours(0,0,0,0)), {
      message: "La fecha de la reserva no puede ser en el pasado"
  })),

  reserveTime: z.string()
      .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido. Use HH:mm")
      .refine(time => {
          const [hour] = time.split(":").map(Number);
          return hour >= 9 && hour <= 23;
      }, { message: "La hora debe estar entre 09:00 y 23:59" }),

  commensalsNumber: z.preprocess((val) => {
    if (typeof val === "string") return parseInt(val, 10);
    return val;
  }, z.number()
    .int("Debe ser un número entero")
    .min(1, "Debe ser al menos 1 comensal")
    .max(50, "No puede superar 50 comensales")
  ),

  cancelationDate: z.preprocess((val) => {
      if (!val) return undefined;
      if (typeof val === "string" || val instanceof Date) return new Date(val);
  }, z.date().optional())
}); 


export type SchemaReservation = z.infer<typeof ReservationSchema>;

export const PartialReservationSchema = ReservationSchema.partial();

export type PartialSchemaReservation = z.infer<typeof PartialReservationSchema>;

export function validateReservation(data: SchemaReservation) {
  const result = ReservationSchema.safeParse(data);
    if(!result.success) {
            throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
        }
  return result.data;
}

export function validatePartialReservation(data: PartialSchemaReservation) {
  const result = PartialReservationSchema.safeParse(data);
    if(!result.success) {
            throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
        }
  return result.data;
}

