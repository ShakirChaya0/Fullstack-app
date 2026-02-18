import { PartialSchemaPolicy  } from '../../shared/validators/PolicyZod.js';
import { Policy } from '../entities/Policy.js';

export interface IPolicyRepository { 
    updatePolicy(idPolitica:number ,data: PartialSchemaPolicy): Promise<Policy>;
    getPolicy(): Promise<Policy>;
}