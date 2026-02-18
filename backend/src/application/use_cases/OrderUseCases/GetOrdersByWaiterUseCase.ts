import { Order } from "../../../domain/entities/Order.js";
import { OrderRepository } from "../../../infrastructure/database/repository/OrderRepository.js";
import { WaiterRepository } from "../../../infrastructure/database/repository/WaiterRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetOrdersByWaiterUseCase {
    constructor(
        private readonly orderRepository = new OrderRepository(),
        private readonly waiterRepository = new WaiterRepository()
    ) {}

    public async execute(waiterId: string): Promise<Order[]> {
        const waiter = await this.waiterRepository.getWaiterById(waiterId);

        if (!waiter) throw new NotFoundError("Mozo no encontrado");

        const orders = await this.orderRepository.getOrdersByWaiter(waiterId);
        return orders;
    }
}