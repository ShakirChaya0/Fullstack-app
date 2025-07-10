import { WaiterRepository } from "../../../infrastructure/database/repository/WaiterRepository.js";
import { Waiter } from "../../../domain/entities/Waiter.js";

export class GetWaiterById {
    constructor(
        private readonly waiterRepository = new WaiterRepository()
    ) {}
    public async execute(id: number): Promise<Waiter | null> {
        return await this.waiterRepository.getWaiterById(id);
    }
}