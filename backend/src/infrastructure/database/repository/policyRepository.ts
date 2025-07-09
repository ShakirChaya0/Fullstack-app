import { PrismaClient } from '@prisma/client';
import { PartialSchemaPolicy  } from '../../../shared/validators/policyZod.js';
import { Policy } from '../../../domain/entities/Policy.js';
import { IPolicyRepository } from '../../../domain/repositories/IPolicyRepository.js';

const prisma = new PrismaClient();


export class PolicyRepository implements IPolicyRepository {
    public async updatePolicy(idPolitica: number,data: PartialSchemaPolicy): Promise<Policy> {
        const updatePolicy = await prisma.politicasRestaurante.update({
            where: { idPolitica: idPolitica },
            data: {
                ...data
            }
        });
        return new Policy(
            updatePolicy.idPolitica,
            updatePolicy.minutosTolerancia,
            updatePolicy.horarioMaximoDeReserva,
            updatePolicy.horasDeAnticipacionParaCancelar,
            updatePolicy.horasDeAnticipacionParaReservar,
            updatePolicy.limiteDeNoAsistencias,
            updatePolicy.cantDiasDeshabilitacion,
            updatePolicy.porcentajeIVA,
            updatePolicy.montoCubiertosPorPersona
        )
    }
    public async getById(idPolitica: number): Promise<Policy> {
        const policy = await prisma.politicasRestaurante.findUnique({
            where: { idPolitica: idPolitica }
        });
        if (!policy) {
            throw new Error(`Policy with id ${idPolitica} not found`);
        }
        return new Policy(
            policy.idPolitica,
            policy.minutosTolerancia,
            policy.horarioMaximoDeReserva,
            policy.horasDeAnticipacionParaCancelar,
            policy.horasDeAnticipacionParaReservar,
            policy.limiteDeNoAsistencias,
            policy.cantDiasDeshabilitacion,
            policy.porcentajeIVA,
            policy.montoCubiertosPorPersona
        )
    }
}