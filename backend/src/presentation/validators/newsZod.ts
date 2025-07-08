import z from 'zod'

const newsSchema = z.object({
    titulo: z.string({message: "El titulo debe ser un string"}).nonempty({message: "Este campo es requerido"}).min(6),
    descripcion: z.string({message: "La descripcion debe ser un string"}).nonempty({message: "Este campo es requerido"}).min(12),
    fechaInicio: z.string({message: "La fecha debe ser un string"}).nonempty({message: "Este campo es requerido"}),
    fechaFin: z.string({message: "La fecha debe ser un string"}).nonempty({message: "Este campo es requerido"})
});

export type SchemaNews = z.infer<typeof newsSchema>;

const partialNewsSchema = newsSchema.partial();

export type PartialSchemaNews = z.infer<typeof partialNewsSchema>;

export function ValidateNews(data: any){
    return newsSchema.safeParse(data)
}

export function ValidateNewsPartial(data: Partial<any>){
    return newsSchema.partial().safeParse(data)
}
