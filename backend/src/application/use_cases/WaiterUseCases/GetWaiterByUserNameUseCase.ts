import { Waiter } from "../../../domain/entities/Waiter.js";
import { WaiterRepository } from "../../../infrastructure/database/repository/WaiterRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetWaiterByUserName {
    constructor(
        private readonly waiterRepository = new WaiterRepository()
    ) {}

    public async execute(userName: string): Promise<Waiter> {
        const waiter = await this.waiterRepository.getWaiterByUserName(userName);

        if (!waiter) throw new NotFoundError("Mozo no encontrado");

        return waiter
    }
}