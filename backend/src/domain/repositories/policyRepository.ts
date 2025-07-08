import { PoliticasRestaurante } from "@prisma/client";
import { SchemaPolicy  } from '../../presentation/validators/policyZod.js';

export interface IPolicyRepository { 
    updatePoliticy(idPolitica:number ,data: SchemaPolicy): Promise<PoliticasRestaurante>;
    getById(idPolitica: number): Promise<PoliticasRestaurante | null>;
}