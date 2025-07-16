import z from "zod";
import { ValidationError } from "../exceptions/ValidationError.js";

const ReservationSchema = z.object({
  cancelationDate: z.date().optional(),
  reservationDate: z.date(),
  reservationTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido. Use HH:MM (24 horas)"),
  status: z.enum(["Realizada", "Asistida", "No Asistida", "Cancelada"]),
  clientId: z.string(),
  tableIds: z.array(z.number().int().positive("El ID de mesa debe ser un número entero positivo")).min(1, "Debe seleccionar al menos una mesa"),
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