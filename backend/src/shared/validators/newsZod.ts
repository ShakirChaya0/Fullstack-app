import z from 'zod'
import { Novedades } from '@prisma/client';
import { NewsClass } from '../../domain/entities/News.js';
import { News } from '../../domain/interfaces/newsInterface.js';
import { ValidationError } from '../exceptions/ValidationError.js';

const newsSchema = z.object({
    titulo: z.string({message: "El titulo debe ser un string"}).nonempty({message: "Este campo es requerido"}).min(6),
    descripcion: z.string({message: "La descripcion debe ser un string"}).nonempty({message: "Este campo es requerido"}).min(12),
    fechaInicio: z.date(),
    fechaFin: z.date()
});

export type SchemaNews = z.infer<typeof newsSchema>

const partialNewsSchema = newsSchema.partial();

export type PartialSchemaNews = z.infer<typeof partialNewsSchema>

export function ValidateNews(data: (Novedades | News)){
    const result = newsSchema.safeParse(data)
    if (!result.success) {
            throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
    }
    return result.data
}

export function ValidateNewsPartial(data: Partial<Novedades | NewsClass>){
    const result = newsSchema.partial().safeParse(data)
    if (!result.success) {
        const mensajes = result.error.errors.map(e => e.message).join(", ")
        throw new ValidationError(`${mensajes}`)
    }
    return result.data;
}
