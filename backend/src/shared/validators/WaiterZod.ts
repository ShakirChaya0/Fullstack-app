import { z } from 'zod';
import { ValidationError } from '../exceptions/ValidationError.js';

export const WaiterSchema = z.object({
    
    nombreUsuario: z.string({ required_error: "nombreUsuario es obligatorio" })
        .min(1, 'El nombre de usuario del mozo es obligatorio')
        .max(50, 'El nombre de usuario del mozo no puede exceder los 50 caracteres'),

    contrasenia: z.string({ required_error: "contraseña es obligatorio" })
        .min(6, 'La contraseña del mozo debe tener al menos 6 caracteres')
        .max(100, 'La contraseña del mozo no puede exceder los 100 caracteres'),

    nombre: z.string({ required_error: "nombre es obligatorio" })
        .min(1, 'El nombre del mozo es obligatorio')
        .max(50, 'El nombre del mozo no puede exceder los 50 caracteres'),
    
    apellido: z.string({ required_error: "apellido es obligatorio" })
        .min(1, 'El apellido del mozo es obligatorio')
        .max(50, 'El apellido del mozo no puede exceder los 50 caracteres'),

    dni: z.string({ required_error: "dni es obligatorio" })
        .min(1, 'El DNI del mozo es obligatorio')
        .max(10, 'El DNI del mozo no puede exceder los 10 caracteres'),
    
    telefono: z.string()
    .min(5, 'El teléfono debe tener al menos 5 caracteres')
    .max(15, 'El teléfono no puede exceder los 15 caracteres')
    .regex(/^\+?\d+$/, 'El teléfono debe contener solo números y puede incluir un + al inicio'),

    email: z.string({ required_error: "email es obligatorio" })
        .email('El correo electrónico del mozo debe ser válido')
        .max(100, 'El correo electrónico del mozo no puede exceder los 100 caracteres'),
});

export type SchemaWaiter = z.infer<typeof WaiterSchema>;

const partialWaiterSchema = WaiterSchema.partial();

export type PartialSchemaWaiter = z.infer<typeof partialWaiterSchema>;

export function ValidateWaiter(data: SchemaWaiter) {
    const result = WaiterSchema.safeParse(data);
    if (!result.success) {
        throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
    }
    return result.data;
}

export function ValidateWaiterPartial(data: PartialSchemaWaiter) {
    const result = partialWaiterSchema.safeParse(data);
    if (!result.success) {
        throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
    }
    return result.data;
}
