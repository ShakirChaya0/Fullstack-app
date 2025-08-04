import { Request, Response, NextFunction } from "express"
import { OrderSchema, ValidateOrder } from "../../shared/validators/orderZod.js"
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { CUU02RegisterOrder } from "../../application/use_cases/OrderUseCases/CUU02RegisterOrder.js";
import { UUID } from "crypto";

export class OrderController {
    constructor(
        private readonly cUU02RegisterOrder = new CUU02RegisterOrder()
    ){}

    public create = async (req: Request , res: Response, next: NextFunction) => {
        try {
            const {order, waiterId, tableNumber}: {order: OrderSchema, waiterId: UUID, tableNumber: number} = req.body 
            const clientId = req.params.idCliente; 
            if(!clientId) {
                throw new ValidationError("Se ingresó un ID inválido")
            }

            if(!tableNumber || isNaN(+tableNumber)){
                throw new ValidationError("El numero de la mesa debe ser entero");
            }

            if (!waiterId) {
                throw new ValidationError("Se ingresó un ID inválido")
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