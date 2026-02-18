import { PolicyRepository } from '../../../infrastructure/database/repository/PolicyRepository.js';
import { Policy } from '../../../domain/entities/Policy.js';

export class GetPolicyUseCase {
    constructor(
        private readonly policyRepository = new PolicyRepository()
    ) {}

    public async execute(): Promise<Policy | null> {
        return await this.policyRepository.getPolicy();
    }
}