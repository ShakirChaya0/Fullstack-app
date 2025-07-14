import { Precios } from '@prisma/client';
import z from 'zod'

export const PreciosSchema = z.object({
    idProducto: z.number().int().positive({ message: "El idProducto debe ser un número entero positivo" }),
    monto: z.number().positive({ message: "El monto debe ser un número positivo" })
        .refine(val => Number.isInteger(val * 100), { message: "El monto debe tener como máximo 2 decimales" }),
});

export type SchemaPrice = z.infer<typeof PreciosSchema>;

export function ValidatePrice(data: Precios){
    return PreciosSchema.safeParse(data)
}