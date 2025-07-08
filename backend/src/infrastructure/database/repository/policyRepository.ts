import { PrismaClient, PoliticasRestaurante } from '@prisma/client';
import { SchemaPoliticy  } from '../../../presentation/validators/policyZod.js';

const prisma = new PrismaClient();

export class PoliticyRepository {
    static async updatePoliticy(idPolitica: number,data: SchemaPoliticy): Promise<PoliticasRestaurante> {

        // Actualizar la política en la base de datos
        return await prisma.politicasRestaurante.update({
            where: { idPolitica: idPolitica },
            data: {
                ...data
            }
        });
    }
    static async getById(idPolitica: number): Promise<PoliticasRestaurante | null> {
        return await prisma.politicasRestaurante.findUnique({
            where: { idPolitica: idPolitica }
        });
    }
}