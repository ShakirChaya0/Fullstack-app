import { Response, NextFunction } from "express"
import { OrderSchema, ValidateOrder } from "../../shared/validators/orderZod.js"
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { CUU02RegisterOrder } from "../../application/use_cases/OrderUseCases/RegisterOrderUseCase.js";
import { NotFoundError } from "../../shared/exceptions/NotFoundError.js";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware.js";
import { UnauthorizedError } from "../../shared/exceptions/UnauthorizedError.js";
import { BusinessError } from "../../shared/exceptions/BusinessError.js";

export class OrderController {
    constructor(
        private readonly cUU02RegisterOrder = new CUU02RegisterOrder()
    ){}

    public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { tableNumber, order }: { tableNumber: string | undefined, order: OrderSchema } = req.body 
            const user = req.user
            const qrToken =  req.qrToken

            // No hay Usuario JWT y No tiene token del QR 
            if (!user && !qrToken) throw new UnauthorizedError('No se encontro el token del QR y el usuario no esta logeado')

            // No tiene token del QR y No es un Mozo
            if(!qrToken && user?.tipoUsuario !== 'Mozo') throw new UnauthorizedError('No se encontro el token del QR y el usuario no esta logeado')
            
            // Tiene token del QR y es Mozo --> Error de Negocio
            if(qrToken && user?.tipoUsuario === 'Mozo') throw new UnauthorizedError('Un Mozo no debe tener un token del QR')

            if(!tableNumber && user?.tipoUsuario === 'Mozo') throw new ValidationError('Número de mesa es requerido')

            
            console.log('Estoy en la mitad del controlador')

            const validatedOrder = ValidateOrder(order)
            console.log('Pase zOD')
            if(!validatedOrder.success) throw new ValidationError(`Validation failed: ${validatedOrder.error.message}`);
            const createdOrder = await this.cUU02RegisterOrder.execute(validatedOrder.data, user?.idUsuario, user?.tipoUsuario, qrToken, tableNumber);
            res.status(201).json(createdOrder);
        } 
        catch(error) {
            next(error);
        }
    }
}