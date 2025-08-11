import { OrderSchema } from "../../shared/validators/orderZod.js";
import { Order, OrderStatus } from "../entities/Order.js";
import { OrderLineStatus } from "../entities/OrderLine.js";

export interface IOrderRepository {
    getActiveOrders(): Promise<Order[]>;
    getOrdersByWaiter(waiterId: string): Promise<Order[]>;
    create(order: OrderSchema, waiterId: string, tableNumber: number): Promise<Order | null>;
    getOne(id: number): Promise<Order | null>;
    changeState(order: Order, state: OrderStatus): Promise<Order>;
    changeOrderLineStatus(orderId: number, lineNumber: number,status: OrderLineStatus): Promise<Order>; 
}