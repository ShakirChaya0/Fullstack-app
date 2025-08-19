import { Order } from "../../../domain/entities/Order.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { OrderLineStatus } from "../../../shared/types/SharedTypes.js";

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

        const isFinish = order.orderLines.filter(ol => ol.status !== "Terminada")
        const isInProcess = order.orderLines.some(ol => ol.status === "En_Preparacion")

        if (order.status === "Solicitado" && isInProcess) await this.orderRepository.changeState(order, "En_Preparacion")
        if (isFinish.length === 0) return await this.orderRepository.changeState(order, "Completado")
        else return order 
    }
}