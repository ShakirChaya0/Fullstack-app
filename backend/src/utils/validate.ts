import z from 'zod'
import { Bebida, Comida, Update, UpdateBebida, UpdateComida } from '../interfaces/productos.js';

const ProductosSchema = z.object({
    nombre: z.string().nonempty({message: "El nombre es requerido"}).min(3).max(255),
    descripcion: z.string().nonempty({message: "La descripcion es requerida"}).min(10).max(255),
    estado: z.enum(["Disponible", "No Disponible"]),
    tipo: z.enum(["Entrada", "Plato principal", "Postre"]).optional(),
    esSinGluten: z.boolean().optional(),
    esVegetariana: z.boolean().optional(),
    esVegana: z.boolean().optional(),
    esAlcoholica: z.boolean().optional(),
});

export type SchemaProductos = z.infer<typeof ProductosSchema>;

const partialProductosSchema = ProductosSchema.partial();

export type PartialSchemaProductos = z.infer<typeof partialProductosSchema>;


export function ValidateProduct(data: Comida | Bebida){
    return ProductosSchema.safeParse(data)
}

export function ValidateProductPartial(data: UpdateComida | UpdateBebida){
    return ProductosSchema.partial().safeParse(data)
}
