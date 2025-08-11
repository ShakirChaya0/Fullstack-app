import { PrismaClient } from '@prisma/client';
import { PartialSchemaPolicy  } from '../../../shared/validators/Fix_policyZod.js';
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

    public async getPolicy(): Promise<Policy> {
        const policy = await prisma.politicasRestaurante.findMany();

        return new Policy(
            policy[0].idPolitica,
            policy[0].minutosTolerancia,
            policy[0].horarioMaximoDeReserva,
            policy[0].horasDeAnticipacionParaCancelar,
            policy[0].horasDeAnticipacionParaReservar,
            policy[0].limiteDeNoAsistencias,
            policy[0].cantDiasDeshabilitacion,
            policy[0].porcentajeIVA,
            policy[0].montoCubiertosPorPersona
        )
    }
}