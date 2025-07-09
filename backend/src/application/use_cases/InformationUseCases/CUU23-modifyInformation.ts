import { InformationRepository } from '../../../infrastructure/database/repository/InformationRepository.js';
import { Information } from '../../../domain/entities/Information.js';
import { PartialSchemaInformation } from '../../../shared/validators/informationZod.js';


export class CUU23ModifyInformation {
    constructor(
        private readonly informationRepository: InformationRepository  = new InformationRepository()
    ){}

    public async execute(idInformacion: number, data: PartialSchemaInformation): Promise<Information> {
        const existingInformation = await this.informationRepository.getById(idInformacion);

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

        const informationDatabase = await this.informationRepository.updateInformation(idInformacion, draft);
        return informationDatabase;
    }
}