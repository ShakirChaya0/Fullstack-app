import z from "zod"; 
import { ValidationError } from "../exceptions/ValidationError.js";

export const ClientSchema = z.object({
    nombreUsuario: z.string({ required_error: "El nombre de usuario es obligatorio" })
        .trim()
        .min(2, 'El nombre de usuario no puede tener menos de 2 caracteres')
        .max(50, 'El nombre de usuario no puede exceder los 50 caracteres'),

    contrasenia: z.string({ required_error: "La contraseña es obligatoria" })
        .trim()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/, "La contraseña debe incluir una mayúscula, una minúscula y un número.")
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

    telefono: z.string({ required_error: "El teléfono es obligatorio" })
        .trim()
        .min(5, 'El teléfono debe tener al menos 5 caracteres')
        .max(15, 'El teléfono no puede exceder los 15 caracteres')
        .regex(/^\+?\d+$/, 'El teléfono debe contener solo números y puede incluir un + al inicio'),

    fechaNacimiento: z.string({ required_error: "La fecha de nacimiento es obligatorio" })
        .refine(str => /^\d{2}\/\d{2}\/\d{4}$/.test(str), {
            message: "Formato inválido. Usa dd/mm/yyyy",
        })
        .transform(str => {
            const [day, month, year] = str.split("/").map(Number);
            return new Date(year, month - 1, day);
        })
        .refine(date => !isNaN(date.getTime()), {
            message: "Fecha inválida",
        })
        .refine(date => date <= new Date(), {
            message: "La fecha no puede estar en el futuro",
        })
        .refine(date => {
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            return age >= 10;
        }, {
            message: "Debes tener al menos 10 años",
        }),
}); 

export type SchemaCliente = z.infer<typeof ClientSchema>; 


export function validateClient(data: SchemaCliente) {
    const result = ClientSchema.safeParse(data); 
    if(!result.success) {
        throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
    }
    return result.data;
}  

const PartialSchemClient = ClientSchema.partial(); 

export type PartialClientSchema = z.infer<typeof PartialSchemClient>; 

export function validateClientPartial(data: PartialClientSchema) {
        const result = PartialSchemClient.safeParse(data);
        if (!result.success) {
            throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
        }
        return result.data;
}