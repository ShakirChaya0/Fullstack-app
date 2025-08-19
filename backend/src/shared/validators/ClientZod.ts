import z from "zod"; 
import { ValidationError } from "../exceptions/ValidationError.js";

export const ClientSchema = z.object({
    nombreUsuario: z.string()
            .min(1, 'El nombre de usuario del mozo es obligatorio')
            .max(50, 'El nombre de usuario del mozo no puede exceder los 50 caracteres'),
    contrasenia: z.string().nonempty({message: 'La contraseña es obligatoria'}).min(6, 'La contraseña del mozo debe tener al menos 6 caracteres').max(100, 'La contraseña del mozo no puede exceder los 100 caracteres'),
    email: z.string()
        .email('El correo electrónico debe ser válido')
        .max(100, 'El correo electrónico no puede exceder los 100 caracteres'),
    nombre: z.string()
            .min(1, 'El nombre del mozo es obligatorio')
            .max(50, 'El nombre del mozo no puede exceder los 50 caracteres'), 
    apellido: z.string()
            .min(1, 'El apellido del mozo es obligatorio')
            .max(50, 'El apellido del mozo no puede exceder los 50 caracteres'),
    telefono: z.string()
            .min(5, 'El teléfono del mozo debe tener al menos 5 caracteres')
            .max(15, 'El teléfono del mozo no puede exceder los 15 caracteres'),
    fechaNacimiento: z.string()
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