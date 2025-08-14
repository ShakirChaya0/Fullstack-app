import { z } from 'zod';
import { ValidationError } from '../exceptions/ValidationError.js';

const AdminSchema = z.object({
    nombreUsuario: z.string().min(2, 'El nombre del administrador no puede tener menos de 2 caracteres').max(50, 'El nombre del administrador no puede exceder los 50 caracteres'),
    contrasenia: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres').max(100, 'La contraseña no puede exceder los 100 caracteres'),
    email: z.string().email('El correo electrónico del mozo debe ser válido').max(100, 'El correo electrónico del mozo no puede exceder los 100 caracteres'),
    nombre: z.string().min(1, 'El apellido es obligatorio').max(50, 'El apellido no puede exceder los 50 caracteres'),
    apellido: z.string().min(1, 'El apellido es obligatorio').max(50, 'El apellido no puede exceder los 50 caracteres'),
    dni: z.string()
        .regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos')
        .refine((dni) => {
            const num = parseInt(dni);
        return num >= 1000000 && num <= 99999999;
        }, 'El DNI debe ser un número válido entre 1.000.000 y 99.999.999'),
    telefono: z.string().min(5, 'El teléfono debe tener al menos 5 caracteres').max(15, 'El teléfono no puede exceder los 15 caracteres'),
});

type SchemaAdmin = z.infer<typeof AdminSchema>;  

const partialSchemaAdmin = AdminSchema.partial();

export type PartialSchemaAdmin = z.infer<typeof partialSchemaAdmin>;

export function ValidatePartialAdmin(data: Partial<SchemaAdmin>) {
    const result = partialSchemaAdmin.safeParse(data);
    if (!result.success) {
        const mensajes = result.error.errors.map(e => e.message).join(", ")
        throw new ValidationError(`${mensajes}`)
    }
    return result.data;
}

