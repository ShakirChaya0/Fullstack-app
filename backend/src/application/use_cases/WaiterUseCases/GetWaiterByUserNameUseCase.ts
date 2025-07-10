import { Waiter } from "../../../domain/entities/Waiter.js";
import { WaiterRepository } from "../../../infrastructure/database/repository/WaiterRepository.js";

export class GetWaiterByUserName {
    constructor(
        private readonly waiterRepository = new WaiterRepository()
    ) {}

    public async execute(userName: string): Promise<Waiter | null> {
        return await this.waiterRepository.getWaiterByUserName(userName);
    }
}