import { InformationRepository } from '../../../infrastructure/database/repository/InformationRepository.js';
import { Information } from '../../../domain/entities/Information.js';
import { PartialSchemaInformation } from '../../../shared/validators/InformationZod.js';


export class CUU23ModifyInformation {
    constructor(
        private readonly informationRepository = new InformationRepository()
    ){}

    public async execute(data: PartialSchemaInformation): Promise<Information> {
        const existingInformation = await this.informationRepository.getInformation();

        const updatedInformation = {
            ...existingInformation,
            ...data,
        }

        const draft = {
            nombreRestaurante: updatedInformation.nombreRestaurante,
            direccionRestaurante: updatedInformation.direccionRestaurante,
            razonSocial: updatedInformation.razonSocial,
            telefonoContacto: updatedInformation.telefonoContacto,
        }   

        const informationDatabase = await this.informationRepository.updateInformation(existingInformation.idInformacion, draft);
        return informationDatabase;
    }
}