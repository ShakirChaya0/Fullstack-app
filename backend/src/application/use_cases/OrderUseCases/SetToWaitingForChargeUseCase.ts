import { Order } from "../../../domain/entities/Order.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class SetToWaitingForChargeUseCase {
    constructor(
        private orderRepository = new OrderRepository()
    ){}
    
    async execute(orderId: number): Promise<Order> {
        const orderFound = await this.orderRepository.getOne(orderId);
        if (!orderFound) throw new NotFoundError("Pedido no encontrado");

        if (orderFound.status !== "Pendiente_De_Pago") throw new BusinessError("El pedido debe estar pendiente de pago para poder esperar su cobro");
        const order = await this.orderRepository.changeState(orderFound, "Pendiente_De_Cobro");
        return order;
    }
}