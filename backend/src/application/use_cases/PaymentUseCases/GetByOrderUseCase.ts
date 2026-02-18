import { Payment } from "../../../domain/entities/Payment.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { PaymentRepository } from "../../../infrastructure/database/repository/PaymentRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetByOrderUseCase {
    constructor(
        private orderRepository = new OrderRepository(),
        private paymentRepository = new PaymentRepository() 
    ) {}

    public async execute(orderId: number): Promise<Payment | null> {
        const order = await this.orderRepository.getOne(orderId);
        if (!order) throw new NotFoundError("Pedido no encontrado");

        return await this.paymentRepository.getByOrder(order);
    }
}