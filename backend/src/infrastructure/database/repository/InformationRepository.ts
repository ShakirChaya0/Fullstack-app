import { Information } from '../../../domain/entities/Information.js';
import { IRestaurantInformation } from '../../../domain/repositories/IRestaurantInformation.js';
import { PrismaClient } from '@prisma/client';
import { PartialSchemaInformation } from '../../../shared/validators/informationZod.js';
import { NotFoundError } from '../../../shared/exceptions/NotFoundError.js';

const prisma = new PrismaClient();

export class InformationRepository implements IRestaurantInformation {

    // Al ser una sola instancia no es necesario hacer un getById, se podría hacer un getAll y retornar el único registro
    // del array. Si queda como un GetById estarías obligando al usuario un ID de la información que siempre va a ser 1.
    public async getById(idInformacion: number): Promise<Information> {
        const information = await prisma.informacionRestaurante.findUnique({
            where: { idInformacion: idInformacion }
        });
        if (!information) {
            throw new NotFoundError("Información no encontrada");
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