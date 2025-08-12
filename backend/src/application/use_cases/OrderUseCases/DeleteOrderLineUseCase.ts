import { Order } from "../../../domain/entities/Order.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class DeleteOrderLineUseCase {
    constructor(
        private readonly orderRepository = new OrderRepository()
    ){}

    public async execute(orderId: number, lineNumber: number): Promise<Order>{
        const order = await this.orderRepository.getOne(orderId)
        
        if (!order) {
            throw new NotFoundError("Pedido no encontrado");
        }
        
        const existThisLine = order.orderLines.some(line => line.lineNumber === lineNumber);


        if(!existThisLine) {
            throw new NotFoundError("No existe la linea de pedido en el pedido")
        }

        if(order.status != "Solicitado") {
             throw new BusinessError("No se puede eliminar la línea si no se encuentra en estado solicitado")
        }

        const newOrder = await this.orderRepository.deleteOrderLine(orderId, lineNumber)

        return newOrder
    }
}