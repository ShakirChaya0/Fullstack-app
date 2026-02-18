import { Waiter } from "../../../domain/entities/Waiter.js";
import { WaiterRepository } from "../../../infrastructure/database/repository/WaiterRepository.js";

export class GetWaiterByUserName {
    constructor(
        private readonly waiterRepository = new WaiterRepository()
    ) {}

    public async execute(userName: string, page: number): Promise<{Waiters: Waiter[], totalItems: number, pages: number}> {
        const waiter = await this.waiterRepository.getWaiterByUserName(userName, page);
        return waiter
    }
}