import { Information } from '../../../domain/entities/Information.js';
import { IRestaurantInformation } from '../../../domain/repositories/IRestaurantInformation.js';
import prisma from "../prisma/PrismaClientConnection.js"
import { PartialSchemaInformation } from '../../../shared/validators/InformationZod.js';

export class InformationRepository implements IRestaurantInformation {
    public async getInformation(): Promise<Information> {
        const information = await prisma.informacionRestaurante.findMany();

        return new Information(
            information[0].idInformacion,
            information[0].nombreRestaurante,
            information[0].direccionRestaurante,
            information[0].razonSocial,
            information[0].telefonoContacto,
        );
    }

    public async updateInformation(idInformacion: number, data: PartialSchemaInformation): Promise<Information> {
        const updatedInformation = await prisma.informacionRestaurante.update({
            where: { idInformacion: idInformacion },
            data: {
                ...data
            }
        });
        return new Information(
            updatedInformation.idInformacion,
            updatedInformation.nombreRestaurante,
            updatedInformation.direccionRestaurante,
            updatedInformation.razonSocial,
            updatedInformation.telefonoContacto,
        );
    }
    
}