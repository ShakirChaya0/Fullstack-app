import { PaymentMethod } from "../../../domain/entities/Payment.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { PaymentRepository } from "../../../infrastructure/database/repository/PaymentRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class RegisterPaymentUseCase {
    constructor(
        private orderRepository = new OrderRepository(),
        private paymentRepository = new PaymentRepository()
    ){}
    
    async execute(orderId: number, paymentMethod: PaymentMethod, transactionId: string | null): Promise<void> {
        const order = await this.orderRepository.getOne(orderId);
        if (!order) throw new NotFoundError("Pedido no encontrado");
        
        if (order.status === "Pendiente_De_Pago" || order.status === "Pendiente_De_Cobro") {
            await this.orderRepository.changeState(order, "Pagado");
            await this.paymentRepository.create(order, paymentMethod, transactionId);
        }
        throw new BusinessError("El pedido debe estar pendiente de pago o cobro para poder ser pagado");
    }
}