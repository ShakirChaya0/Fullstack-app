import { PoliticasRestaurante } from '@prisma/client';
import { z } from 'zod';
import { Policy } from '../../domain/entities/Policy.js';

export const PolicySchema = z.object({
  minutosTolerancia: z.number()
    .int('Los minutos de tolerancia deben ser un número entero')
    .min(0, 'Los minutos de tolerancia no pueden ser negativos')
    .max(120, 'Los minutos de tolerancia no pueden ser mayores a 120 minutos'),

  horarioMaximoDeReserva: z.string(),

  horasDeAnticipacionParaCancelar: z.number()
    .int('Las horas de anticipación para cancelar deben ser un número entero')
    .min(0, 'Las horas de anticipación para cancelar no pueden ser negativas')
    .max(168, 'Las horas de anticipación para cancelar no pueden ser mayores a 168 horas (7 días)'),

  horasDeAnticipacionParaReservar: z.number()
    .int('Las horas de anticipación para reservar deben ser un número entero')
    .min(0, 'Las horas de anticipación para reservar no pueden ser negativas')
    .max(8760, 'Las horas de anticipación para reservar no pueden ser mayores a 8760 horas (1 año)'),

  limiteDeNoAsistencias: z.number()
    .int('El límite de no asistencias debe ser un número entero')
    .min(1, 'El límite de no asistencias debe ser al menos 1')
    .max(20, 'El límite de no asistencias no puede ser mayor a 20'),

  cantDiasDeshabilitacion: z.number()
    .int('Los días de deshabilitación deben ser un número entero')
    .min(1, 'Los días de deshabilitación deben ser al menos 1')
    .max(365, 'Los días de deshabilitación no pueden ser mayores a 365 días'),

  porcentajeIVA: z.number()
    .int('El porcentaje de IVA debe ser un número entero')
    .min(0, 'El porcentaje de IVA no puede ser negativo')
    .max(100, 'El porcentaje de IVA no puede ser mayor a 100'),

  montoCubiertosPorPersona: z.number()
    .int('El monto de cubiertos por persona debe ser un número entero')
    .min(0, 'El monto de cubiertos por persona no puede ser negativo')
    .max(10000, 'El monto de cubiertos por persona no puede ser mayor a 10000')
});

export type SchemaPolicy = z.infer<typeof PolicySchema>;

const PolicySchemaPartial = PolicySchema.partial();

export type PartialSchemaPolicy = z.infer<typeof PolicySchemaPartial>;

export function ValidatePolicy(data: Policy | PoliticasRestaurante) {
    const result = PolicySchema.safeParse(data);
    if (!result.success) {
        const mensajes = result.error.errors.map(e => e.message).join(", ");
        throw new Error(mensajes);
    }
    return result.data; 
}

export function ValidatePolicyPartial(data: Partial<PoliticasRestaurante> | Partial<Policy>) {
    const validate = PolicySchema.partial().safeParse(data);  
    if (!validate.success) {
      const mensajes = validate.error.errors.map(e => e.message).join(", ")
            throw new Error(mensajes);
        }
    return validate.data;
}