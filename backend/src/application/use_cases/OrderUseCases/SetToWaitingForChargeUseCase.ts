import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class SetToWaitingForChargeUseCase {
    constructor(
        private orderRepository = new OrderRepository()
    ){}
    
    async execute(orderId: number): Promise<void> {
        const order = await this.orderRepository.getOne(orderId);
        if (!order) throw new NotFoundError("Pedido no encontrado");

        if (order.status !== "Pendiente_De_Pago") throw new BusinessError("El pedido debe estar pendiente de pago para poder esperar su cobro");
        await this.orderRepository.changeState(order, "Pendiente_De_Cobro");
    }
}