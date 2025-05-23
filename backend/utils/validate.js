import z from 'zod'

const ProductosSchema = z.object({
    nombre: z.string().nonempty({message: "El nombre es requerido"}).min(3).max(255),
    descripcion: z.string().nonempty({message: "La descripcion es requerida"}).min(10).max(255),
    categoria: z.enum(["Comida", "Bebida"]),
    tipo: z.enum(["Entrada", "Plato principal", "Postre"]).optional(),
    esSinGluten: z.boolean().optional(),
    esVegetariana: z.boolean().optional(),
    esVegana: z.boolean().optional(),
    esAlcoholica: z.boolean().optional(),
});


export function ValidateProduct(data){
    return ProductosSchema.safeParse(data)
}

export function ValidateProductPartial(data){
    return ProductosSchema.partial().safeParse(data)
}


// {
//     "idProducto": 1,
//     "nombre": "Hamburguesa clásica",
//     "descripcion": "Con carne, lechuga y tomate",
//     "categoria": "Comida",
//     "tipo": "Plato principal",
//     "esSinGluten": false,
//     "esVegana": false,
//     "esVegetariana": false
//   },
//   {
//     "idProducto": 7,
//     "nombre": "Agua mineral",
//     "descripcion": "Agua sin gas",
//     "categoria": "Bebida",
//     "esAlcoholica": false
//   },