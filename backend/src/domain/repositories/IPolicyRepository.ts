import { PartialSchemaPolicy  } from '../../shared/validators/policyZod.js';
import { Policy } from '../entities/Policy.js';

export interface IPolicyRepository { 
    updatePolicy(idPolitica:number ,data: PartialSchemaPolicy): Promise<Policy>;
    getPolicy(): Promise<Policy>;
}