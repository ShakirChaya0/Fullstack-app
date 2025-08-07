import { Payment, PaymentMethod } from "../../../domain/entities/Payment.js";
import { PaymentRepository } from "../../../infrastructure/database/repository/PaymentRepository.js";

export class GetByPaymentMethod {
    constructor(
        private paymentRepository = new PaymentRepository() 
    ) {}

    public async execute(paymentMethod: PaymentMethod): Promise<Payment[]> {
        return await this.paymentRepository.getByPaymentMethod(paymentMethod);
    }
}