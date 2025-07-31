import z from "zod"
import { Order } from "../../domain/entities/Order.js";

const SchemaOrderLine =
        z.object({
        nombre: z.string().nonempty({message: "El nombre es requerido"}).min(3).max(255),
        tipo: z.enum(["Entrada", "Plato_Principal", "Postre"]).optional(),
        monto: z.number({ required_error: "monto es obligatorio" }).positive({ message: "El monto debe ser un número positivo" })
        .refine(val => Number.isInteger(val * 100), { message: "El monto debe tener como máximo 2 decimales" }),
        cantidad: z.number()
        .int('La cantidad de una linea debe ser un número entero')
        .min(1, 'La cantidad de una linea debe ser mayor a 1')
        .max(20, 'La cantidad de una linea debe ser menor a 20'),
        esAlcoholica: z.boolean().optional(),
    })


export const SchemaOrder = z.object({
    cantidadCubiertos: z.number()
        .int('La cantidad de cubiertos debe ser un número entero')
        .min(1, 'La cantidad de cubiertos debe ser mayor a 1')
        .max(50, 'La cantidad de cubiertos debe ser menor a 50'),
    observacion: z.string()
        .min(1, 'La observación debe tener al menos un caracter')
        .max(500, 'La observación debe tener menos de 500 caracteres'), 
    items:  z.array(SchemaOrderLine),
});

export type OrderSchema = z.infer<typeof SchemaOrder>

const PartialSchemaOrder = SchemaOrder.partial()

export type PartialOrderSchema = z.infer<typeof PartialSchemaOrder>

export type OrderLineSchema = z.infer<typeof SchemaOrderLine>

export function ValidateOrder(data: Order){ 
    return SchemaOrder.safeParse(data)
}

export function ValidateOrderPartial(data: Partial<Order>){
    return PartialSchemaOrder.safeParse(data)
}
