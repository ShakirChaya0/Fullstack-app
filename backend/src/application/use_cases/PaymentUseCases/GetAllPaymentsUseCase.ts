import { Payment } from "../../../domain/entities/Payment.js";
import { PaymentRepository } from "../../../infrastructure/database/repository/PaymentRepository.js";

export class GetAllPaymentUseCase {
    constructor(
        private paymentRepository = new PaymentRepository() 
    ) {}

    public async execute(): Promise<Payment[]> {
        return await this.paymentRepository.getAll();
    }
}