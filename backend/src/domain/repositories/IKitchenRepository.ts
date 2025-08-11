import { TipoUsuario_Type } from "@prisma/client";
import { Kitchen } from "../entities/Kitchen.js";
import { PartialSchemaKitchen } from "../../shared/validators/Fix_kitchenZod.js";

export interface IKitchenRepository {
    getAll (tipoUsuario: TipoUsuario_Type): Promise<Kitchen | null>
    update (id: string, data: PartialSchemaKitchen): Promise<Kitchen>
}