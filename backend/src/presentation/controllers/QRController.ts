import { NextFunction, Response } from "express";
import { RegisterOrModifyQRUseCase } from "../../application/use_cases/QrUseCases/GenerateQRUseCase.js";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware.js";
import { NotFoundError } from "../../shared/exceptions/NotFoundError.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";


export class QRController {
    constructor(
        private readonly registerOrModifyQRUseCase = new RegisterOrModifyQRUseCase(),
    ){}

    public createOrUpdate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { tableNumber } = req.body
            const waiterId = req.user?.idUsuario

            if (!tableNumber || isNaN(+tableNumber)) {
                throw new ValidationError("El nro de Mesa ingresado debe ser un número");
            }

            if(!waiterId) throw new NotFoundError('No se encontro el mozo')

            const createdQR = await this.registerOrModifyQRUseCase.execute(+tableNumber, waiterId)
            res.status(201).json({ QrToken: createdQR })
        }catch(error) {
            next(error);
        }
    }

}