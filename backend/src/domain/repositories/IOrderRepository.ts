import { Order, OrderStatus } from "../entities/Order.js";

export interface IOrderRepository {
    getOne(id: number): Promise<Order | null>;
    changeState(order: Order, state: OrderStatus): Promise<void>;
}