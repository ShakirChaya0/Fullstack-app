import z from 'zod'

const SugerenciaSchema = z.object({
  idProducto: z.number({ required_error: "idProducto es obligatorio" }).int().positive(),

  fechaDesde: z.string({ required_error: "fechaDesde es obligatorio" })
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
    .refine(date => date >= new Date(new Date().setHours(0,0,0,0)), {
      message: "La fecha desde no puede ser en el pasado",
    }),

  fechaHasta: z.string({ required_error: "fechaDesde es obligatorio" })
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
    .refine(date => date >= new Date(new Date().setHours(0,0,0,0)), {
      message: "La fecha hasta no puede ser en el pasado",
    }),
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