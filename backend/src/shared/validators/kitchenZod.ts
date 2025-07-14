import z from 'zod'
import { ValidationError } from '../exceptions/ValidationError.js';

const kitchenSchema = z.object({
    nombreUsuario: z.string({message: "El titulo debe ser un string"}).nonempty({message: "Este campo es requerido"}).min(6),
    email: z.string({message: "La descripcion debe ser un string"}).nonempty({message: "Este campo es requerido"}).min(6).email({message: "Debe ser un email lo ingresado"}),
    contrasenia: z.string({message: "La contraseña debe ser un string"}).nonempty({message: "Este campo es requerido"}).min(7),
});

export type SchemaKitchen = z.infer<typeof kitchenSchema>

const partialKitchenSchema = kitchenSchema.partial();

export type PartialSchemaKitchen = z.infer<typeof partialKitchenSchema>

export function ValidateKitchen(data: any){
    const result = kitchenSchema.safeParse(data)
    if (!result.success) {
            throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
    }
    return result.data
}

export function ValidateKitchenPartial(data: Partial<any>){
    const result = kitchenSchema.partial().safeParse(data)
    if (!result.success) {
        const mensajes = result.error.errors.map(e => e.message).join(", ")
        throw new ValidationError(`${mensajes}`)
    }
    return result.data;
}
