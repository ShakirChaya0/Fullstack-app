import { Order } from "../../../domain/entities/Order.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";

export class GetActiveOrdersUseCase {
    constructor(
        private readonly orderRepository = new OrderRepository()
    ) {}

    public async execute(): Promise<Order[]> {
        const orders = await this.orderRepository.getActiveOrders();
        return orders;
    }
}