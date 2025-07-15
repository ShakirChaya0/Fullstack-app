import { EstadoCliente } from '@prisma/client';
import { ValidationError } from '../exceptions/ValidationError.js';
import z from 'zod'


export const ClientStateScheme = z.object({
    fechaActualizacion: z.preprocess((val) => new Date(val as string), z.date()),
    estado: z.enum(['Habilitado', 'Deshabilitado'])
});

export type SchemaClientState = z.infer<typeof ClientStateScheme>;

export function ValidateClientState(data: EstadoCliente){
    const result = ClientStateScheme.safeParse(data)
    if (!result.success) {
        throw new ValidationError(result.error.errors.map(e => e.message).join(", "))
    }
    return result.data;
    
}