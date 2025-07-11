import { z } from 'zod';
import { Waiter } from '../../domain/entities/Waiter.js';
import  { Mozo } from '@prisma/client';
import { ValidationError } from '../exceptions/ValidationError.js';

export const WaiterSchema = z.object({
    nombreUsuario: z.string()
        .min(1, 'El nombre de usuario del mozo es obligatorio')
        .max(50, 'El nombre de usuario del mozo no puede exceder los 50 caracteres'),

    contrasenia: z.string()
        .min(6, 'La contraseña del mozo debe tener al menos 6 caracteres')
        .max(100, 'La contraseña del mozo no puede exceder los 100 caracteres'),

    nombre: z.string()
        .min(1, 'El nombre del mozo es obligatorio')
        .max(50, 'El nombre del mozo no puede exceder los 50 caracteres'),
    
    apellido: z.string()
        .min(1, 'El apellido del mozo es obligatorio')
        .max(50, 'El apellido del mozo no puede exceder los 50 caracteres'),

    DNI: z.number()
        .int('El DNI del mozo debe ser un número entero')
        .min(1000000, 'El DNI del mozo debe tener al menos 7 dígitos')
        .max(99999999, 'El DNI del mozo no puede exceder los 8 dígitos'),
    
    telefono: z.string()
        .min(5, 'El teléfono del mozo debe tener al menos 5 caracteres')
        .max(15, 'El teléfono del mozo no puede exceder los 15 caracteres'),
    
    email: z.string()
        .email('El correo electrónico del mozo debe ser válido')
        .max(100, 'El correo electrónico del mozo no puede exceder los 100 caracteres'),
    
})

export type SchemaWaiter = z.infer<typeof WaiterSchema>;

const partialWaiterSchema = WaiterSchema.partial();

export type PartialSchemaWaiter = z.infer<typeof partialWaiterSchema>;

export function ValidateWaiter(data: Mozo | Waiter) {
    const result = WaiterSchema.safeParse(data);
    if (!result.success) {
        throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
    }
    return result.data;
}

export function ValidateWaiterPartial(data: Partial<Mozo | Waiter>) {
    const result = partialWaiterSchema.safeParse(data);
    if (!result.success) {
        throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
    }
    return result.data;
}
