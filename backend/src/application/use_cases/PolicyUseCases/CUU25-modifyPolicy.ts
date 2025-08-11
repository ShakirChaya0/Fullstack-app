import { PolicyRepository } from '../../../infrastructure/database/repository/Fix_policyRepository.js'
import { PoliticasRestaurante } from '@prisma/client'; // cambiar
import { PartialSchemaPolicy } from '../../../shared/validators/Fix_policyZod.js';


export class CUU25ModifyPolicys {
  constructor(
    private readonly policyRepository = new PolicyRepository()
  ){}


  public async execute(data: PartialSchemaPolicy): Promise<PoliticasRestaurante> {
        const existingPolitic = await this.policyRepository.getPolicy();

        const updatedPolitic = {
            ...existingPolitic,
            ...data,
        }

        // validar datos de entrada
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

    const politicDatabase = await this.policyRepository.updatePolicy(existingPolitic.idPolitica, draft);
    return politicDatabase;
  }
}