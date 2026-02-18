import { PaymentMethod } from "../../shared/types/SharedTypes.js";
import { Order } from "../entities/Order.js";
import { Payment } from "../entities/Payment.js";

export interface IPaymentRepository {
    getAll(): Promise<Payment[]>;
    getByOrder(order: Order): Promise<Payment | null>;
    getByDateRange(dateFrom: Date, dateTo: Date): Promise<Payment[]>;
    getByPaymentMethod(paymentMethod: PaymentMethod): Promise<Payment[]>;
    create(order: Order, paymentMethod: PaymentMethod, transactionId: string | null): Promise<void>;
}