import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class RegisterPaymentUseCase {
    constructor(
        private orderRepository = new OrderRepository()
    ){}
    
    async execute(orderId: number): Promise<void> {
        const order = await this.orderRepository.getOne(orderId);
        if (!order) throw new NotFoundError("Pedido no encontrado");
        
        if (order.estado === "Pendiente_De_Pago" || order.estado === "Pendiente_De_Cobro") {
            await this.orderRepository.changeState(order, "Pagado");

            // CREAR y REGISTRAR PAGOS
        }
        throw new BusinessError("El pedido debe estar pendiente de pago o cobro para poder ser pagado");
    }
}