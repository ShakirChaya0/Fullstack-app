import { Kitchen } from "../../../domain/entities/Kitchen.js";
import { KitchenRepository } from "../../../infrastructure/database/repository/KitchenRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetKitchenUseCase {
    constructor(
        private readonly kitchenRepository = new KitchenRepository()
    ){}
    async execute (): Promise<Kitchen> {
        const kitchen = await this.kitchenRepository.getAll("SectorCocina")
        if(!kitchen) throw new NotFoundError("No se encontro al usuario del SectorCocina")
        return kitchen
    }
}