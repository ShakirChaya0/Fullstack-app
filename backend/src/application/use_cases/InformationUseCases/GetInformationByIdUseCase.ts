import { InformationRepository } from '../../../infrastructure/database/repository/InformationRepository.js';
import { Information } from '../../../domain/entities/Information.js';

export class GetInformationByIdUseCase {
    constructor(
        private readonly informationRepository = new InformationRepository()
    ) {}

    public async execute(idInformacion: number): Promise<Information | null> {
        return await this.informationRepository.getById(idInformacion);
    }
}