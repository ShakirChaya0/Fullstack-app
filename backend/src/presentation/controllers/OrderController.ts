import { Response, NextFunction } from "express"
import { ioConnection } from "./../../App.js"
import { OrderSchema, ValidateOrder } from "../../shared/validators/OrderZod.js"
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { CUU02RegisterOrder } from "../../application/use_cases/OrderUseCases/RegisterOrderUseCase.js";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware.js";
import { UnauthorizedError } from "../../shared/exceptions/UnauthorizedError.js";
import { OrderLineStatus } from "../../domain/entities/OrderLine.js";
import { UpdateOrderLineUseCase } from "../../application/use_cases/OrderUseCases/UpdateOrderLineStatusUseCase.js";
import { GetActiveOrdersUseCase } from "../../application/use_cases/OrderUseCases/GetActiveOrdersUseCase.js";
import { GetOrdersByWaiterUseCase } from "../../application/use_cases/OrderUseCases/GetOrdersByWaiterUseCase.js";


export class OrderController {
    constructor(
        private readonly cUU02RegisterOrder = new CUU02RegisterOrder(),
        private readonly updateOrderLineStatusUseCase = new UpdateOrderLineUseCase(),
        private readonly getActiveOrdersUseCase = new GetActiveOrdersUseCase(),
        private readonly getOrdersByWaiterUseCase = new GetOrdersByWaiterUseCase()
    ){}

    public create = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const { tableNumber, order }: { tableNumber: number | undefined, order: OrderSchema } = req.body 
            const user = req.user
            const qrToken =  req.qrToken

            // No hay Usuario JWT y No tiene token del QR 
            if (!user && !qrToken) throw new UnauthorizedError('No se encontro el token del QR y el usuario no esta logeado')

            // No tiene token del QR y No es un Mozo
            if(!qrToken && user?.tipoUsuario !== 'Mozo') throw new UnauthorizedError('No se encontro el token del QR y el usuario no es un Mozo')
            
            // No tiene Mesa y Es un Mozo
            if(!tableNumber && user?.tipoUsuario === 'Mozo') throw new ValidationError('Número de mesa es requerido')

            // Tiene token del QR y es Mozo --> Error de Negocio
            if(qrToken && user?.tipoUsuario === 'Mozo') throw new UnauthorizedError('Un Mozo no debe tener un token del QR')

            // Tiene Mesa y es Cliente --> Error de Negocio
            if(tableNumber && user?.tipoUsuario !== 'Mozo') throw new UnauthorizedError('Un Comensal no debe ingresar número de Mesa')

            if(tableNumber && isNaN(+tableNumber)) throw new ValidationError('El número de mesa debe ser número entero')

            const validatedOrder = ValidateOrder(order)

            if(!validatedOrder.success) throw new ValidationError(`Validation failed: ${validatedOrder.error.message}`);
            const createdOrder = await this.cUU02RegisterOrder.execute(validatedOrder.data, user?.idUsuario, user?.tipoUsuario, qrToken, tableNumber ? +tableNumber : undefined);

            if (qrToken) {
                ioConnection.to("cocina")
                    .emit("newOrder", createdOrder.toKitchenInfo());
                ioConnection.to(`mozo:${createdOrder.waiter?.username}`).
                    emit("newOrder", createdOrder.toWaiterInfo());
                ioConnection.to(`comensal:${qrToken}`)
                    .emit("newOrder", createdOrder.toClientInfo());
            } else {
                ioConnection.to("cocina")
                    .emit("newOrder", createdOrder.toKitchenInfo());
                ioConnection.to(`mozo:${createdOrder.waiter?.username}`)
                    .emit("newOrder", createdOrder.toWaiterInfo());
            }

            res.status(201).json(createdOrder);
        } 
        catch(error) {
            next(error);
        }
    }

    public async updateOrderLineStatus(idPedido: number, nroLinea: number, estadoLP: OrderLineStatus){ 
        try {
            if(isNaN(nroLinea)){
                throw new ValidationError("El número de Línea debe ser válido");
            }
            if(isNaN(idPedido)){
                throw new ValidationError("El número de Pedido debe ser válido");
            }

            return await this.updateOrderLineStatusUseCase.execute(idPedido, nroLinea, estadoLP)
        }
        catch(error) {
            console.log(error);
            return
        }
    }

    public async getActiveOrders() {
        try {
            const orders = await this.getActiveOrdersUseCase.execute();
            return orders.map(o => { return o.toKitchenInfo() })
        }
        catch(error) {
            console.log(error);
            return
        }
    }

    public async getOrdersByWaiter(waiterId: string) {
        try {
            const orders = await this.getOrdersByWaiterUseCase.execute(waiterId);
            return orders.map(o => { return o.toWaiterInfo() })
        } 
        catch (error) {
            console.log(error);
            return
        }
    }
}