import { NextFunction, Response, Request } from "express";
import { RegisterOrModifyQRUseCase } from "../../application/use_cases/QrUseCases/GenerateQRUseCase.js";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware.js";
import { NotFoundError } from "../../shared/exceptions/NotFoundError.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { GetTokenByTableUseCase } from "../../application/use_cases/QrUseCases/GetTokenByTableUseCase.js";


export class QRController {
    constructor(
        private readonly registerOrModifyQRUseCase = new RegisterOrModifyQRUseCase(),
        private readonly getTokenByTableUseCase = new GetTokenByTableUseCase()
    ){}

    public getQrTokenByTable = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tableNumber = req.params.nroMesa;
            if (!tableNumber || isNaN(+tableNumber)) throw new ValidationError("El número de Mesa debe ser un número");
            
            const token = await this.getTokenByTableUseCase.execute(+tableNumber);

            res
                .cookie('QrToken', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 1000 * 60 * 60 * 24 })
                .status(204).send();

        } catch(error) {
            next(error);
        }
    }

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
        } catch(error) {
            next(error);
        }
    }
}