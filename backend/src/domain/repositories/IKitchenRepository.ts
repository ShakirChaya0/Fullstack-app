import { Kitchen } from "../entities/Kitchen.js";
import { PartialSchemaKitchen } from "../../shared/validators/KitchenZod.js";
import { UserType } from "../../shared/types/SharedTypes.js";

export interface IKitchenRepository {
    getAll (tipoUsuario: UserType): Promise<Kitchen | null>
    update (id: string, data: PartialSchemaKitchen): Promise<Kitchen>
}