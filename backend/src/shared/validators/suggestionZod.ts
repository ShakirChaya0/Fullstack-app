import { Sugerencias } from '@prisma/client';
import z from 'zod'

const SugerenciaSchema = z.object({
  fechaDesde: z.preprocess((val) => new Date(val as string), z.date()),
  fechaHasta: z.preprocess((val) => new Date(val as string), z.date()),
  idProducto: z.number().int().positive()
});

export type SchemaSuggestion = z.infer<typeof SugerenciaSchema>;

const partialProductosSchema = SugerenciaSchema.partial();

export type PartialSchemaSuggestion = z.infer<typeof partialProductosSchema>;

export function ValidateSuggestion(data: Sugerencias){
    return SugerenciaSchema.safeParse(data)
}

export function ValidateSuggestionPartial(data: Partial<Sugerencias>){
    return SugerenciaSchema.partial().safeParse(data)
}