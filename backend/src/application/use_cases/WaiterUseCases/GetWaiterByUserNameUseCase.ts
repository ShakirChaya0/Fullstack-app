import { Waiter } from "../../../domain/entities/Waiter.js";
import { WaiterRepository } from "../../../infrastructure/database/repository/WaiterRepository.js";
import { ValidationError } from "../../../shared/exceptions/ValidationError.js";

export class GetWaiterByUserName {
    constructor(
        private readonly waiterRepository = new WaiterRepository()
    ) {}

    public async execute(userName: string | null): Promise<Waiter> {
        // Es necesaria esta validación? ya estaría hecha en el controlador
        if (!userName) {
            throw new ValidationError("El nombre de usuario es obligatorio");
        }
        return await this.waiterRepository.getWaiterByUserName(userName);
    }
}