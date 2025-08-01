import { Payment } from "../../../domain/entities/Payment.js";
import { PaymentRepository } from "../../../infrastructure/database/repository/PaymentRepository.js";

export class GetByDateRange {
    constructor(
        private paymentRepository = new PaymentRepository() 
    ) {}

    public async execute(dateFrom: Date, dateTo: Date): Promise<Payment[]> {
        return await this.paymentRepository.getByDateRange(dateFrom, dateTo);
    }
}