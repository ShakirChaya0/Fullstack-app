import { Order } from "../../../domain/entities/Order.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { OrderLineStatus, OrderStatus } from "../../../shared/types/SharedTypes.js";

export class UpdateOrderLineUseCase {
    constructor(
        private readonly orderRepository = new OrderRepository(),
    ){}

    public async execute(orderId: number, lineNumber: number, status: OrderLineStatus): Promise<Order>{
        let order = await this.orderRepository.getOne(orderId)

        if (!order) throw new NotFoundError("No se ha encontrado el Pedido para la línea de pedido")

        const orderLine = order.orderLines.some(order => order.lineNumber === lineNumber);

        if (!orderLine) throw new NotFoundError("No se ha encontrado la línea de pedido para el pedido")
            
        order = await this.orderRepository.changeOrderLineStatus(orderId, lineNumber,status)

        const allFinished = order.orderLines.every(l => l.status === 'Terminada');
        const anyInProgress = order.orderLines.some(l => l.status === 'En_Preparacion');
        const anyFinished = order.orderLines.some(l => l.status === 'Terminada');

        let newOrderStatus: OrderStatus;
        if (allFinished) newOrderStatus = 'Completado';
        else if (anyInProgress || anyFinished) newOrderStatus = 'En_Preparacion';
        else newOrderStatus = 'Solicitado';

        if (order.status !== newOrderStatus) return await this.orderRepository.changeState(order, newOrderStatus);
        else return order 
    }
}