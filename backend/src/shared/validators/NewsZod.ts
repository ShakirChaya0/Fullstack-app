import z from 'zod'
import { ValidationError } from '../exceptions/ValidationError.js';

const newsSchema = z.object({
    titulo: z.string({message: "El titulo debe ser un string"}).nonempty({message: "Este campo es requerido"}).min(6),
    descripcion: z.string({message: "La descripcion debe ser un string"}).nonempty({message: "Este campo es requerido"}).min(12),
    fechaInicio: z.date({message: "La fecha debe ser de tipo date"}),
    fechaFin: z.date({message: "La fecha debe ser de tipo date"})
});

export type SchemaNews = z.infer<typeof newsSchema>

const partialNewsSchema = newsSchema.partial();

export type PartialSchemaNews = z.infer<typeof partialNewsSchema>

export function ValidateNews(data: SchemaNews){
    const result = newsSchema.safeParse(data)
    if (!result.success) {
            throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
    }
    return result.data
}

export function ValidateNewsPartial(data: PartialSchemaNews){
    const result = partialNewsSchema.safeParse(data)
    if (!result.success) {
        const mensajes = result.error.errors.map(e => e.message).join(", ")
        throw new ValidationError(`${mensajes}`)
    }
    return result.data;
}
