import z from "zod"; 
import { Table } from "../../domain/entities/Table.js";

const tableSchema = z.object({
    capacidad: z.number({message: "La capacidad debe ser un numero entero"}).min(1).max(10), 
    estado : z.enum(["Libre", "Ocupado", "Reservado"])
}); 

export type schemaTable = z.infer<typeof tableSchema>; 

export function validateTable(data: Table) {
    const result = tableSchema.safeParse(data);
    if (!result.success) {
        throw new Error(
        JSON.stringify(result.error.flatten().fieldErrors)
        );
    }
    return result.data;
}

const schemaTablePartial = z.object({
    estado : z.enum(["Libre", "Ocupado", "Reservado"])
})

export type schemaTablePartial = z.infer<typeof schemaTablePartial> 

export function validatePartialTable (data: Partial<Table>) {
    const result = schemaTablePartial.safeParse(data);
    if (!result.success) {
        throw new Error(
            JSON.stringify(result.error.flatten().fieldErrors)
            );
    }

    return result.data;
}



