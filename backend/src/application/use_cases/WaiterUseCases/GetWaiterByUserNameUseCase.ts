import { Waiter } from "../../../domain/entities/Waiter.js";
import { WaiterRepository } from "../../../infrastructure/database/repository/WaiterRepository.js";

export class GetWaiterByUserName {
    constructor(
        private readonly waiterRepository = new WaiterRepository()
    ) {}

    public async execute(userName: string | null): Promise<Waiter> {
        if (!userName) {
            throw new Error("El nombre de usuario es obligatorio");
        }
        return await this.waiterRepository.getWaiterByUserName(userName);
    }
}