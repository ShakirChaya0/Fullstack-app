import z from "zod"; 
import { ValidationError } from "../exceptions/ValidationError.js";

const tableSchema = z.object({
    capacity: z.number({message: "La capacidad debe ser un numero entero"}).min(1).max(10), 
}); 

export type schemaTable = z.infer<typeof tableSchema>; 

export function validateTable(data: schemaTable) {
    const result = tableSchema.safeParse(data);
    if (!result.success) {
        throw new ValidationError(
        JSON.stringify(result.error.flatten().fieldErrors)
        );
    }
    return result.data;
}







