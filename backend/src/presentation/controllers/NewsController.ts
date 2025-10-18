import { Request, Response, NextFunction } from "express";
import { CreateNewsUseCases } from "../../application/use_cases/NewsUseCases/CreateNewsUseCase.js";
import { ModifyNewsUseCases } from "../../application/use_cases/NewsUseCases/ModifyNewsUseCase.js";
import { ValidateNews, ValidateNewsPartial } from "../../shared/validators/NewsZod.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { GetByTitleNewsUseCase } from "../../application/use_cases/NewsUseCases/GetByTitleNewsUseCase.js";
import { GetAllNewsUseCase } from "../../application/use_cases/NewsUseCases/GetAllNewsUseCase.js";
import { DeleteNewsUseCase } from "../../application/use_cases/NewsUseCases/DeleteNewsUseCase.js";
import { ActiveNewsUseCase } from "../../application/use_cases/NewsUseCases/ActiveNewsUseCase.js";

export class NewsController {
    constructor(
        private readonly createNewsUC = new CreateNewsUseCases(),
        private readonly modifyNewsUC = new ModifyNewsUseCases(),
        private readonly getoneNewsUC = new GetByTitleNewsUseCase(),
        private readonly getAllNewsUC = new GetAllNewsUseCase(),
        private readonly deleteNewsUC = new DeleteNewsUseCase(),
        private readonly activeNewsUC = new ActiveNewsUseCase()
    ){}

    async actives(req: Request, res: Response, next: NextFunction) {
        try{
            const news = await this.activeNewsUC.execute()
            res.status(200).json(news)
        }catch(error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try{
            const validatedData = ValidateNews(req.body)
            const news = await this.createNewsUC.execute(validatedData)
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

    async getByTitle (req: Request, res: Response, next: NextFunction) {
        try{
            const { newsTitle } = req.params
            const { page, status } = req.query

            if (!newsTitle && (typeof newsTitle === "string")) throw new ValidationError("El Titulo ingresado debe ser un string");
            const draft = (page && !isNaN(+page)) ? +page : 1; 
            
            const news = await this.getoneNewsUC.execute(newsTitle, draft, status)
            res.status(200).json(news)
        }
        catch(error){
            next(error)
        }
    }

    async getAll (req: Request, res: Response, next: NextFunction) {
        try{
            const { page, status } = req.query
            const draft = (page && !isNaN(+page)) ? +page : 1; 
            const result = await this.getAllNewsUC.execute(draft, status)
            res.status(200).json(result)
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
}