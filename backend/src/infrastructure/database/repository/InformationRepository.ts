import { Information } from '../../../domain/entities/Information.js';
import { IRestaurantInformation } from '../../../domain/repositories/IRestaurantInformation.js';
import { PrismaClient } from '@prisma/client';
import { PartialSchemaInformation } from '../../../shared/validators/informationZod.js';

const prisma = new PrismaClient();

export class InformationRepository implements IRestaurantInformation {
    public async getById(idInformacion: number): Promise<Information> {
        const information = await prisma.informacionRestaurante.findUnique({
            where: { idInformacion: idInformacion }
        });
        if (!information) {
            throw new Error(`Information with id ${idInformacion} not found`);
        }
        return new Information(
            information.idInformacion,
            information.nombreRestaurante,
            information.direccionRestaurante,
            information.razonSocial,
            information.telefonoContacto,
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