import z from 'zod'

export const PreciosSchema = z.object({
    idProducto: z.number({ required_error: "idProducto es obligatorio" }).int().positive({ message: "El idProducto debe ser un número entero positivo" }),
    monto: z.number({ required_error: "monto es obligatorio" }).positive({ message: "El monto debe ser un número positivo" })
        .refine(val => Number.isInteger(val * 100), { message: "El monto debe tener como máximo 2 decimales" }),
});

export type SchemaPrice = z.infer<typeof PreciosSchema>;

export function ValidatePrice(data: SchemaPrice){
    return PreciosSchema.safeParse(data)
}