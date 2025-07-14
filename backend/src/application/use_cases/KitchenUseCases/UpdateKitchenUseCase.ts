import { KitchenRepository } from "../../../infrastructure/database/repository/KitchenRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { PartialSchemaKitchen } from "../../../shared/validators/kitchenZod.js";
import { PasswordHashingService } from "../../services/PasswordHashing.js";

export class UpdateKitchenUseCase {
    constructor(
        private readonly kitchenRepository = new KitchenRepository(),
        private readonly hashService = new PasswordHashingService()
    ){}
    async execute (data: PartialSchemaKitchen) {
        const kitchen = await this.kitchenRepository.getAll("SectorCocina")
        if(!kitchen) throw new NotFoundError("No se encontro al usuario del SectorCocina")

        if(data.contrasenia) {
            data.contrasenia = await this.hashService.hashPassword(data.contrasenia)
        }

        const updatedKitchen = await this.kitchenRepository.update(kitchen.userId, data)
        return updatedKitchen
    }
}