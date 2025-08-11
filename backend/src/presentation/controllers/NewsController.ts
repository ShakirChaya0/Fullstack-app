import { Request, Response, NextFunction } from "express";
import { CreateNewsUseCases } from "../../application/use_cases/NewsUseCases/CreateNewsUseCase.js";
import { ModifyNewsUseCases } from "../../application/use_cases/NewsUseCases/ModifyNewsUseCase.js";
import { ValidateNewsPartial } from "../../shared/validators/Fix_newsZod.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { GetOneNewsUseCase } from "../../application/use_cases/NewsUseCases/GetOneNewsUseCase.js";
import { GetAllNewsUseCase } from "../../application/use_cases/NewsUseCases/GetAllNewsUseCase.js";
import { DeleteNewsUseCase } from "../../application/use_cases/NewsUseCases/DeleteNewsUseCase.js";
import { GetActiveNewsUseCase } from "../../application/use_cases/NewsUseCases/GetActiveNewsUseCase.js";

export class NewsController {
    constructor(
        private readonly createNewsUC = new CreateNewsUseCases(),
        private readonly modifyNewsUC = new ModifyNewsUseCases(),
        private readonly getoneNewsUC = new GetOneNewsUseCase(),
        private readonly getAllNewsUC = new GetAllNewsUseCase(),
        private readonly deleteNewsUC = new DeleteNewsUseCase(),
        private readonly getActivesUC = new GetActiveNewsUseCase() 
    ){}

    async create(req: Request, res: Response, next: NextFunction) {
        try{
            const news = await this.createNewsUC.execute(req.body)
            res.status(201).json(news)
        }
        catch(error){
            next(error);
        }
    }

    async modify (req: Request, res: Response, next: NextFunction) {
        try{
            const { newsId } = req.params
            if (!newsId || isNaN(+newsId)) throw new ValidationError("El ID ingresado debe ser un número");
            
            const { fechaInicio, fechaFin } = req.body

            const data = {
                ...req.body,
                fechaInicio: fechaInicio != undefined ? new Date(fechaInicio) : undefined, 
                fechaFin: fechaFin != undefined ? new Date(fechaFin): undefined
            }

            const dataValidated = ValidateNewsPartial(data) 

            const news = await this.modifyNewsUC.execute(+newsId, dataValidated)
            res.status(200).json(news)
        }
        catch(error){
            next(error);
        }
    }

    async getOne (req: Request, res: Response, next: NextFunction) {
        try{
            const { newsId } = req.params
            if (!newsId || isNaN(+newsId)) throw new ValidationError("El ID ingresado debe ser un número");
            
            const news = await this.getoneNewsUC.execute(+newsId)
            res.status(200).json(news)
        }
        catch(error){
            next(error)
        }
    }

    async getAll (req: Request, res: Response, next: NextFunction) {
        try{
            const news = await this.getAllNewsUC.execute()
            res.status(200).json(news)
        }
        catch(error){
            next(error)
        }
    }

    async delete (req: Request, res: Response, next: NextFunction) {
        try{
            const { newsId } = req.params
            if (!newsId || isNaN(+newsId)) throw new ValidationError("El ID ingresado debe ser un número");

            await this.deleteNewsUC.execute(+newsId)
            res.status(204).send()
        }
        catch(error){
            next(error)
        }
    }

    async getActives (req: Request, res: Response, next: NextFunction) {
        try{
            const news = await this.getActivesUC.execute()
            res.status(200).json(news)
        }
        catch(error){
            next(error)
        }
    }
}