import z from 'zod';
import { Information } from '../../domain/entities/Information.js';
import { InformacionRestaurante } from '@prisma/client';

export const InformationSchema = z.object({ 
    nombreRestaurante: z.string({message: "El nombre debe ser un string"}).min(3, "Nombre del restaurante es requerido"),
    direccionRestaurante: z.string().min(3, "Direccion es requerida"),
    razonSocial: z.string().min(3, "El nombre de la empresa es requerido"),
    telefonoContacto: z.string().min(3, "El telefono es requerido")
})

export type SchemaInformation = z.infer<typeof InformationSchema>

const PartialInformationSchema = InformationSchema.partial();

export type PartialSchemaInformation = z.infer<typeof PartialInformationSchema>

export function ValidateInformation(data: Information) {
    const result = InformationSchema.safeParse(data);
    if (!result.success) {
        const mensajes = result.error.errors.map(e => e.message).join(", ");
        throw new Error(mensajes);
    }
    return result.data;
}

export function ValidatePartialInformation(data: Partial<InformacionRestaurante> | Partial<Information>) {
    const validate = PartialInformationSchema.partial().safeParse(data);
    if (!validate.success) {
        const mensajes = validate.error.errors.map(e => e.message).join(", ");
        throw new Error(mensajes);
    }
    return validate.data;
}
