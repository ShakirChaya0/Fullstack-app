import z from "zod"; 

const tableSchema = z.object({
    capacidad: z.number({message: "La capacidad debe ser un numero entero"}).min(1).max(10), 
}); 

export type schemaTable = z.infer<typeof tableSchema>; 

export function validateTable(data: number) {
    const result = tableSchema.safeParse(data);
    if (!result.success) {
        throw new Error(
        JSON.stringify(result.error.flatten().fieldErrors)
        );
    }
    return result.data;
}







