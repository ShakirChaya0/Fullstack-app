import z from 'zod'

const SugerenciaSchema = z.object({
  fechaDesde: z.preprocess((val) => new Date(val as string), z.date()),
  fechaHasta: z.preprocess((val) => new Date(val as string), z.date()),
  idProducto: z.number({ required_error: "idProducto es obligatorio" }).int().positive()
});

export type SchemaSuggestion = z.infer<typeof SugerenciaSchema>;

const partialProductosSchema = SugerenciaSchema.partial();

export type PartialSchemaSuggestion = z.infer<typeof partialProductosSchema>;

export function ValidateSuggestion(data: SchemaSuggestion){
    return SugerenciaSchema.safeParse(data)
}

export function ValidateSuggestionPartial(data: PartialSchemaSuggestion){
    return partialProductosSchema.safeParse(data)
}