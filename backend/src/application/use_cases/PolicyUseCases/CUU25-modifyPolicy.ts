import { PoliticyRepository } from '../../../infrastructure/database/repository/policyRepository.js';
import { PoliticasRestaurante } from '@prisma/client';
import { SchemaPoliticy } from '../../../presentation/validators/policyZod.js';

export class CUU25ModifyPoliticys {
  static async execute(idPolitica: number, data: SchemaPoliticy): Promise<PoliticasRestaurante> {
    // Importar el repositorio de políticas
    const existingPolitic = await PoliticyRepository.getById(idPolitica);

    // Actualizar la política en la base de datos
    const updatedPolitic = {
        ...existingPolitic,
        ...data,
    }
    const politicDatabase = await PoliticyRepository.updatePoliticy(idPolitica, updatedPolitic);
    return politicDatabase;
  }
}