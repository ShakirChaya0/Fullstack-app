import { z } from 'zod';
import { ValidationError } from '../exceptions/ValidationError.js';

const AdminSchema = z.object({
    nombreUsuario: z.string({ required_error: "El nombre de usuario es obligatorio" })
        .trim()
        .min(2, 'El nombre de usuario no puede tener menos de 2 caracteres')
        .max(50, 'El nombre de usuario no puede exceder los 50 caracteres'),

    contrasenia: z.string({ required_error: "La contraseña es obligatoria" })
        .trim()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, 
        "La contraseña debe incluir una mayúscula, una minúscula y un número.")
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .max(100, 'La contraseña no puede exceder los 100 caracteres'),

    email: z.string({ required_error: "El correo electrónico es obligatorio" })
        .trim()
        .email('El correo electrónico debe ser válido')
        .min(1, 'El correo electrónico es obligatorio')
        .max(100, 'El correo electrónico no puede exceder los 100 caracteres'),

    nombre: z.string({ required_error: "El nombre es obligatorio" })
        .trim()
        .min(1, 'El nombre es obligatorio')
        .max(50, 'El nombre no puede exceder los 50 caracteres'),

    apellido: z.string({ required_error: "El apellido es obligatorio" })
        .trim()
        .min(1, 'El apellido es obligatorio')
        .max(50, 'El apellido no puede exceder los 50 caracteres'),

    dni: z.string({ required_error: "El DNI es obligatorio" })
        .trim()
        .regex(/^\d{8}$/, 'El DNI debe tener exactamente 8 dígitos')
        .refine((dni) => {
        const num = parseInt(dni);
        return num >= 1000000 && num <= 99999999;
        }, 'El DNI debe ser un número válido entre 1.000.000 y 99.999.999'),

    telefono: z.string({ required_error: "El teléfono es obligatorio" })
        .trim()
        .min(5, 'El teléfono debe tener al menos 5 caracteres')
        .max(15, 'El teléfono no puede exceder los 15 caracteres')
        .regex(/^\+?\d+$/, 'El teléfono debe contener solo números y puede incluir un + al inicio'),
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

