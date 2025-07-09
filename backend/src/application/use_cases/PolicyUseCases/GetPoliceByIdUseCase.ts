import { PolicyRepository } from '../../../infrastructure/database/repository/PolicyRepository.js';
import { Policy } from '../../../domain/entities/Policy.js';

export class GetPolicyByIdUseCase {
    constructor(
        private readonly policyRepository = new PolicyRepository()
    ) {}

    public async execute(idPolitica: number): Promise<Policy | null> {
        return await this.policyRepository.getById(idPolitica);
    }
}