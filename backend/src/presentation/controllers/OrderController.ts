import { Response, NextFunction } from "express"
import { OrderLineSchema, OrderSchema, PartialOrderMinimal, ValidateOrder, ValidateOrderLine, ValidateOrderPartialMinimal } from "../../shared/validators/OrderZod.js"
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { CUU02RegisterOrder } from "../../application/use_cases/OrderUseCases/RegisterOrderUseCase.js";
import { AuthenticatedRequest } from "../middlewares/AuthMiddleware.js";
import { UnauthorizedError } from "../../shared/exceptions/UnauthorizedError.js";
import { UpdateOrderLineUseCase } from "../../application/use_cases/OrderUseCases/UpdateOrderLineStatusUseCase.js";
import { GetActiveOrdersUseCase } from "../../application/use_cases/OrderUseCases/GetActiveOrdersUseCase.js";
import { GetOrdersByWaiterUseCase } from "../../application/use_cases/OrderUseCases/GetOrdersByWaiterUseCase.js";
import { AddOrderLineUseCase } from "../../application/use_cases/OrderUseCases/AddOrderLineUseCase.js";
import { DeleteOrderLineUseCase } from "../../application/use_cases/OrderUseCases/DeleteOrderLineUseCase.js";
import { UpdateOrderUseCase } from "../../application/use_cases/OrderUseCases/UpdateOrderUseCase.js";
import { OrderSocketService } from "../../application/services/OrderSocketService.js";
import { OrderLineStatus } from "../../shared/types/SharedTypes.js";


export class OrderController {
    constructor(
        private readonly registerOrderUseCase = new CUU02RegisterOrder(),
        private readonly updateOrderLineStatusUseCase = new UpdateOrderLineUseCase(),
        private readonly getActiveOrdersUseCase = new GetActiveOrdersUseCase(),
        private readonly getOrdersByWaiterUseCase = new GetOrdersByWaiterUseCase(),
        private readonly addOrderLineUseCase = new AddOrderLineUseCase(),
        private readonly deleteOrderLineUseCase = new DeleteOrderLineUseCase(),
        private readonly updateOrderUseCase = new UpdateOrderUseCase(),
        private readonly orderSocketService = new OrderSocketService()
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
            const createdOrder = await this.registerOrderUseCase.execute(validatedOrder.data, user?.idUsuario, user?.tipoUsuario, qrToken, tableNumber ? +tableNumber : undefined);

            try {
                await this.orderSocketService.emitOrderEvent("newOrder", createdOrder);
            } catch (error) {
                console.log(error)
            }

            res.status(201).send(createdOrder.toClientInfo());
        } 
        catch(error) {
            next(error);
        }
    }

    // REVISAR: quizá se puede mover a otro lado
    public async getActiveOrders() {
        const orders = await this.getActiveOrdersUseCase.execute();
        return orders.map(o => { return o.toKitchenInfo() });
    }

    // REVISAR: quizá se puede mover a otro lado
    public async getOrdersByWaiter(waiterId: string) {
        const orders = await this.getOrdersByWaiterUseCase.execute(waiterId);
        return orders.map(o => { return o.toWaiterInfo() });
    }

    public async updateOrderLineStatus(idPedido: number, nroLinea: number, estadoLP: OrderLineStatus) { 
        if(isNaN(+nroLinea)) throw new ValidationError("El número de Línea debe ser válido");
        if(isNaN(+idPedido)) throw new ValidationError("El número de Pedido debe ser válido");

        const order =  await this.updateOrderLineStatusUseCase.execute(+idPedido, +nroLinea, estadoLP);
        await this.orderSocketService.emitOrderEvent("updatedOrderLineStatus", order);
    }

    public async addOrderLine(orderId: number, orderLines: OrderLineSchema[]) {
        if(isNaN(orderId)) throw new ValidationError("El número de Pedido debe ser válido");

        const validatedOrderLines = ValidateOrderLine(orderLines);
        if(!validatedOrderLines.success) throw new ValidationError(`Validation failed: ${validatedOrderLines.error.message}`);

        const order = await this.addOrderLineUseCase.execute(orderId, validatedOrderLines.data);
        await this.orderSocketService.emitOrderEvent("addedOrderLine", order);
    }

    public async deleteOrderLine(orderId: number, lineNumber: number) {
        if(isNaN(orderId)) throw new ValidationError("El número de Pedido debe ser válido");
        if(isNaN(lineNumber)) throw new ValidationError("El número de Línea debe ser válido");
        
        const deletedOrder =  await this.deleteOrderLineUseCase.execute(orderId, lineNumber);
        await this.orderSocketService.emitOrderEvent("deletedOrderLine", deletedOrder)
    }

    public async updateOrder(orderId: number, lineNumbers: number[] | undefined, data: Partial<PartialOrderMinimal>) {
        if(isNaN(orderId)) throw new ValidationError("El número de Pedido debe ser válido");

        if ((lineNumbers && !data.items) || (!lineNumbers && data.items)) 
            throw new ValidationError("Para modificar lineas, se requieren los números de las líneas y los items a modificar en conjunto");
    
        const validatedOrder = ValidateOrderPartialMinimal(data);
        if(!validatedOrder.success) throw new ValidationError(`Validation failed: ${validatedOrder.error.message}`);

        const updatedOrder = await this.updateOrderUseCase.execute(orderId, lineNumbers, validatedOrder.data);
        await this.orderSocketService.emitOrderEvent("modifiedOrderLine", updatedOrder);
    }
}