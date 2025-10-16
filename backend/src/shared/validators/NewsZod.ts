import z from 'zod'
import { ValidationError } from '../exceptions/ValidationError.js';

function parseDDMMYYYY(value: string): Date | null {
  const parts = value.split("-");
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day, 0, 0, 0, 0); // local midnight
}

const newsSchema = z.object({
    titulo: z.string({message: "El titulo debe ser un string"}).nonempty({message: "Este campo es requerido"}).min(6),
    descripcion: z.string({message: "La descripcion debe ser un string"}).nonempty({message: "Este campo es requerido"}).min(12),
    fechaInicio: z.preprocess(val => {
    if (typeof val === "string") {
      return parseDDMMYYYY(val);
    }
    return val;
  }, z.date({ invalid_type_error: "Fecha inválida" })),
    fechaFin: z.preprocess(val => {
    if (typeof val === "string") {
      return new Date(val.replace(/\//g, "-"))
    }
    return val
  }, z.date())
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
