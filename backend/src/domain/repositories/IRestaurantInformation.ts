import { PartialSchemaInformation } from '../../shared/validators/informationZod.js';
import { Information } from '../entities/Information.js';

export interface IRestaurantInformation {
    getInformation(): Promise<Information>;
    updateInformation(idInformacion: number, data: PartialSchemaInformation): Promise<Information>;
}