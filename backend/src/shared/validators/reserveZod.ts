import z from "zod";
import { ValidationError } from "../exceptions/ValidationError.js";

const ReserveSchema = z.object({
  cancelationDate: z.date().optional(),
  reserveDate: z.date(),
  reserveTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido. Use HH:MM (24 horas)"),
  status: z.enum(["Realizada", "Asistida", "No Asistida", "Cancelada"]),
  clientId: z.number().int().positive("El ID del cliente debe ser un número entero positivo"),
});

export type SchemaReserve = z.infer<typeof ReserveSchema>;

export function validateReserve(data: Partial<SchemaReserve>) {
  const result = ReserveSchema.safeParse(data);
    if(!result.success) {
            throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
        }
  return result.data;
}

export const PartialReserveSchema = ReserveSchema.partial();

export type PartialSchemaReserve = z.infer<typeof PartialReserveSchema>;

export function validatePartialReserve(data: Partial<SchemaReserve>) {
  const result = PartialReserveSchema.safeParse(data);
    if(!result.success) {
            throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
        }
  return result.data;
}