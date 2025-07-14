import { NextFunction, Request, Response } from "express";
import { GetKitchenUseCase } from "../../application/use_cases/KitchenUseCases/GetKitchenUseCase.js";
import { UpdateKitchenUseCase } from "../../application/use_cases/KitchenUseCases/UpdateKitchenUseCase.js";
import { ValidateKitchenPartial } from "../../shared/validators/kitchenZod.js";

export class KitchenController {
    constructor(
        private readonly getKitchenUC = new GetKitchenUseCase(),
        private readonly updateKitchenUC = new UpdateKitchenUseCase()
    ){}
    async getKitchen(req: Request, res: Response, next: NextFunction) {
        try{
            const kitchen = await this.getKitchenUC.execute()

            const filteredKitchen = {
                nombreUsuario: kitchen.userName,
                email: kitchen.email
            }

            res.status(200).json(filteredKitchen)
        }
        catch(error){
            next(error)
        }
    }
    async updateKitchen (req: Request, res: Response, next: NextFunction) {
        try{
            const data = req.body
            const validatedData = ValidateKitchenPartial(data)
         
            const kitchen = await this.updateKitchenUC.execute(validatedData)

            const filteredKitchen = {
                nombreUsuario: kitchen.userName,
                email: kitchen.email
            }

            res.status(200).json(filteredKitchen)
        }
        catch(error){
            next(error)
        }
    }
}