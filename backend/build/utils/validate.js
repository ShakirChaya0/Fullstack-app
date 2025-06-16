import z from 'zod';
const ProductosSchema = z.object({
    nombre: z.string().nonempty({ message: "El nombre es requerido" }).min(3).max(255),
    descripcion: z.string().nonempty({ message: "La descripcion es requerida" }).min(10).max(255),
    estado: z.enum(["Disponible", "No Disponible"]),
    tipo: z.enum(["Entrada", "Plato principal", "Postre"]).optional(),
    esSinGluten: z.boolean().optional(),
    esVegetariana: z.boolean().optional(),
    esVegana: z.boolean().optional(),
    esAlcoholica: z.boolean().optional(),
});
const partialProductosSchema = ProductosSchema.partial();
export function ValidateProduct(data) {
    return ProductosSchema.safeParse(data);
}
export function ValidateProductPartial(data) {
    return ProductosSchema.partial().safeParse(data);
}
