import { OrderSchema } from "../../shared/validators/Fix_orderZod.js";
import { Order, OrderStatus } from "../entities/Order.js";

export interface IOrderRepository {
    create(order: OrderSchema, waiterId: string, tableNumber: number): Promise<Order | null>;
    getOne(id: number): Promise<Order | null>;
    changeState(order: Order, state: OrderStatus): Promise<void>;
}