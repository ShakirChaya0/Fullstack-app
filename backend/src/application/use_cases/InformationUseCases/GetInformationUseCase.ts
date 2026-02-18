import { InformationRepository } from '../../../infrastructure/database/repository/InformationRepository.js';
import { Information } from '../../../domain/entities/Information.js';

export class GetInformationUseCase {
    constructor(
        private readonly informationRepository = new InformationRepository()
    ) {}

    public async execute(): Promise<Information> {
        return await this.informationRepository.getInformation();
    }
}