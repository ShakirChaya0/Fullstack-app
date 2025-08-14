import { WaiterRepository } from "../../../infrastructure/database/repository/WaiterRepository.js";
import { Waiter } from "../../../domain/entities/Waiter.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetWaiterById {
    constructor(
        private readonly waiterRepository = new WaiterRepository()
    ) {}
    
    public async execute(idMozo: string): Promise<Waiter> {
        const waiter = await this.waiterRepository.getWaiterById(idMozo);

        if (!waiter) throw new NotFoundError("Mozo no encontrado");

        return waiter;
    }
}