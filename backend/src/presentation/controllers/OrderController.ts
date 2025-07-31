import { Request, Response, NextFunction } from "express"
import { ValidateOrder } from "../../shared/validators/orderZod.js"
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { CUU02RegisterOrder } from "../../application/use_cases/OrderUseCases/CUU02RegisterOrder.js";

export class OrderController {
    constructor(
        private readonly cUU02RegisterOrder = new CUU02RegisterOrder()
    ){}

    public create = async (req: Request , res: Response, next: NextFunction) => {
        try {
            const {order, waiterId, tableNumber} = req.body 
            const clientId = req.params.idUsuario; 
            if(!clientId) {
                throw new ValidationError("Se ingreso un ID válido")
            }

            if(!tableNumber || isNaN(+tableNumber)){
                throw new ValidationError("El numero de la mesa debe ser entero");
            }

            if (!waiterId) {
                throw new ValidationError("Se ingresar un ID válido")
            }

            const validatedOrder = ValidateOrder(order)
            if(!validatedOrder.success) throw new ValidationError(`Validation failed: ${validatedOrder.error.message}`);
            const createdOrder = await this.cUU02RegisterOrder.execute(validatedOrder.data, clientId, waiterId, tableNumber);
            res.status(201).json(createdOrder);
        } 
        catch(error) {
            next(error);
        }
    }
}