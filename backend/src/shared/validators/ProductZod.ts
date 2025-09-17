import z from 'zod'

const ProductosSchema = z.object({
    nombre: z.string().nonempty({message: "El nombre es requerido"}).min(3).max(30),
    descripcion: z.string().nonempty({message: "La descripcion es requerida"}).min(10).max(255),
    estado: z.enum(["Disponible", "No_Disponible"]),
    tipo: z.enum(["Entrada", "Plato_Principal", "Postre"]).optional(),
    esSinGluten: z.boolean().optional(),
    esVegetariana: z.boolean().optional(),
    esVegana: z.boolean().optional(),
    esAlcoholica: z.boolean().optional(),
});

export type SchemaProductos = z.infer<typeof ProductosSchema>;

export const partialProductosSchema = ProductosSchema.partial();

export type PartialSchemaProductos = z.infer<typeof partialProductosSchema>;

export function ValidateProduct(data: SchemaProductos){
    return ProductosSchema.safeParse(data)
}

export function ValidateProductPartial(data: PartialSchemaProductos){
    return partialProductosSchema.safeParse(data)
}