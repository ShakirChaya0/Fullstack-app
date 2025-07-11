import { Request, Response, NextFunction } from "express";
import { CreateNewsUseCases } from "../../application/use_cases/NewsUseCases/createNewsUseCases.js";
import { ModifyNewsUseCases } from "../../application/use_cases/NewsUseCases/modifyNewsUseCases.js";
import { ValidateNewsPartial } from "../../shared/validators/newsZod.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";

export class NewsController {
    constructor(
        private createNewsUC = new CreateNewsUseCases(),
        private modifyNewsUC = new ModifyNewsUseCases()
    ){}
    async create(req: Request, res: Response, next: NextFunction) {
        try{
            const news = await this.createNewsUC.execute(req.body)
            res.status(200).json(news)
        }
        catch(error){
            next(error);
        }
    }
    async modify (req: Request, res: Response, next: NextFunction){
        try{
            const {newsId} = req.params
            if (!newsId || isNaN(+newsId)) throw new ValidationError("El ID ingresado debe ser un número");
            
            const { fechaInicio, fechaFin } = req.body

            const data = {
                ...req.body,
                fechaInicio: fechaInicio != undefined ? new Date(fechaInicio) : undefined, 
                fechaFin: fechaFin != undefined ? new Date(fechaFin) : undefined, 
            }

            const dataValidated = ValidateNewsPartial(data) 

            const news = await this.modifyNewsUC.execute(+newsId, dataValidated)
            res.status(200).json(news)
        }
        catch(error){
            next(error);
        }
    }
}