import { Response, NextFunction } from "express"
import { UUID } from "crypto"
import { OrderSchema, ValidateOrder } from "../../shared/validators/orderZod.js"
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { CUU02RegisterOrder } from "../../application/use_cases/OrderUseCases/CUU02RegisterOrder.js";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware.js";

export class OrderController {
    constructor(
        private readonly cUU02RegisterOrder = new CUU02RegisterOrder()
    ){}

    public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const {waiterId, tableNumber, order}: {waiterId: UUID | undefined, tableNumber: number, order: OrderSchema} = req.body 
            const userId = req.user?.idUsuario 
            const userType = req.user?.tipoUsuario 

            if(userType == "Mozo" && waiterId != undefined) throw new ValidationError("Datos mal enviados");

            if(!tableNumber || isNaN(+tableNumber)){
                throw new ValidationError("El numero de la mesa debe ser entero");
            }
            
            const isUUID = (value: string): boolean => {
                return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
            };

            if (waiterId != undefined && (typeof waiterId != "string" || !isUUID(waiterId))) {
                throw new ValidationError("Se ingresó un ID de mozo inválido");
            }

            const validatedOrder = ValidateOrder(order)
            if(!validatedOrder.success) throw new ValidationError(`Validation failed: ${validatedOrder.error.message}`);
            const createdOrder = await this.cUU02RegisterOrder.execute(validatedOrder.data, userId, waiterId, tableNumber);
            res.status(201).json(createdOrder);
        } 
        catch(error) {
            next(error);
        }
    }
}