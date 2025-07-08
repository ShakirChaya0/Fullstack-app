import z from "zod"; 
import { Table } from "../../domain/entities/Table.js";

const tableSchema = z.object({
    capacity: z.number({message: "La capacidad debe ser un numero entero"}).min(1).max(10), 
    state : z.enum(["Libre", "Ocupado", "Reservado"])
}); 

export type schemaTable = z.infer<typeof tableSchema>; 

export function validateTable(data: Table) {
    return tableSchema.safeParse(data);
}

// const schemaTablePartial = tableSchema.partial(); 
// export type SchemaPartialTable = z.infer<typeof schemaTablePartial>; 

// export function validatePartialTable (data: Table) {
//     return tableSchema.partial().safeParse(data);
// }



