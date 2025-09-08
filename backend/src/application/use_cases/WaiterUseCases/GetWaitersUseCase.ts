import { Waiter } from "../../../domain/entities/Waiter.js";
import { WaiterRepository } from "../../../infrastructure/database/repository/WaiterRepository.js";

export class GetWaiter {
    constructor(
        private readonly waiterRepository = new WaiterRepository()
    ) {}

    public async execute(page: number): Promise<{Waiters: Waiter[], totalItems: number, pages: number}> {
        return await this.waiterRepository.getAllWaiters(page);
    }
}