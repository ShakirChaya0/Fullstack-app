import { PolicyRepository } from '../../../infrastructure/database/repository/PolicyRepository.js'
import { PoliticasRestaurante } from '@prisma/client';
import { PartialSchemaPolicy } from '../../../shared/validators/policyZod.js';


export class CUU25ModifyPolicys {
  constructor(
    private readonly policyRepository = new PolicyRepository()
  ){}


  public async execute(idPolitica: number, data: PartialSchemaPolicy): Promise<PoliticasRestaurante> {
        const existingPolitic = await this.policyRepository.getById(idPolitica);

        const updatedPolitic = {
            ...existingPolitic,
            ...data,
        }

        const draft = {
            minutosTolerancia: updatedPolitic.minutosTolerancia,
            horarioMaximoDeReserva: updatedPolitic.horarioMaximoDeReserva,
            horasDeAnticipacionParaCancelar: updatedPolitic.horasDeAnticipacionParaCancelar,
            horasDeAnticipacionParaReservar: updatedPolitic.horasDeAnticipacionParaReservar,
            limiteDeNoAsistencias: updatedPolitic.limiteDeNoAsistencias,
            cantDiasDeshabilitacion: updatedPolitic.cantDiasDeshabilitacion,
            porcentajeIVA: updatedPolitic.porcentajeIVA,
            montoCubiertosPorPersona: updatedPolitic.montoCubiertosPorPersona
        }   

    const politicDatabase = await this.policyRepository.updatePolicy(idPolitica, draft);
    return politicDatabase;
  }
}