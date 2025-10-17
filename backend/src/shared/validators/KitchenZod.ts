import z from 'zod'
import { ValidationError } from '../exceptions/ValidationError.js';

const kitchenSchema = z.object({
    nombreUsuario: z.string({ required_error: "El nombre de usuario es obligatorio" })
        .trim()
        .min(2, 'El nombre de usuario no puede tener menos de 2 caracteres')
        .max(50, 'El nombre de usuario no puede exceder los 50 caracteres'),

    email: z.string({ required_error: "El email es obligatorio" })
        .trim()
        .email('El correo electrónico debe ser válido')
        .min(1, 'El correo electrónico es obligatorio')
        .max(100, 'El correo electrónico no puede exceder los 100 caracteres'),

    contrasenia: z.string({ required_error: "La contraseña es obligatoria" })
        .trim()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "La contraseña debe incluir una mayúscula, una minúscula y un número.")
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(100, 'La contraseña no puede exceder los 100 caracteres'),
});

export type SchemaKitchen = z.infer<typeof kitchenSchema>

const partialKitchenSchema = kitchenSchema.partial();

export type PartialSchemaKitchen = z.infer<typeof partialKitchenSchema>

export function ValidateKitchen(data: SchemaKitchen){
    const result = kitchenSchema.safeParse(data)
    if (!result.success) {
            throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
    }
    return result.data
}

export function ValidateKitchenPartial(data: PartialSchemaKitchen){
    const result = kitchenSchema.partial().safeParse(data)
    if (!result.success) {
        const mensajes = result.error.errors.map(e => e.message).join(", ")
        throw new ValidationError(`${mensajes}`)
    }
    return result.data;
}
