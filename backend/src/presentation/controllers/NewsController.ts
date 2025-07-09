import { Request, Response } from "express";
import { CreateNewsUseCases } from "../../application/use_cases/NewsUseCases/createNewsUseCases.js";
import { ModifyNewsUseCases } from "../../application/use_cases/NewsUseCases/modifyNewsUseCases.js";
import { ValidateNews, ValidateNewsPartial } from "../../shared/validators/newsZod.js";

export class NewsController {
    constructor(
        private createNewsUC = new CreateNewsUseCases(),
        private modifyNewsUC = new ModifyNewsUseCases()
    ){}
    async create(req: Request, res: Response) {
        try{
            const dataValidated = ValidateNews(req.body)
            if(!dataValidated.success) {
                const mensajes = dataValidated.error.errors.map(e => e.message).join(", ")
                throw new Error(`${mensajes}`)
            }
            const news = await this.createNewsUC.execute(dataValidated.data)
            res.status(200).json(news)
        }
        catch(error: any){
            res.status(500).json({error: error.message})
        }
    }
    async modify (req: Request, res: Response){
        try{
            const {newsId} = req.params
            if (!newsId || isNaN(+newsId)) throw new Error("ID sent must be a number")
            
            const dataValidated = ValidateNewsPartial(req.body) 

            const news = await this.modifyNewsUC.execute(+newsId, dataValidated)
            res.status(200).json(news)
        }
        catch(error: any){
            res.status(500).json({ error: error.message })
        }
    }
}