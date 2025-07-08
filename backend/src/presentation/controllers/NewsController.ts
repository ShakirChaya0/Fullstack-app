import { Request, Response } from "express";
import { CreateNewsUseCases } from "../../application/use_cases/NewsUseCases/createNewsUseCases.js";
import { ModifyNewsUseCases } from "../../application/use_cases/NewsUseCases/modifyNewsUseCases.js";

export class NewsController {
    constructor(
        private createNewsUC = new CreateNewsUseCases(),
        private modifyNewsUC = new ModifyNewsUseCases()
    ){}
    async create(req: Request, res: Response) {
        try{
            const data = req.body
            const news = await this.createNewsUC.execute(data)
            res.status(200).json(news)
        }
        catch(error: any){
            res.status(500).json({ error: error.message || "Server Internal Error" })
        }
    }
    async modify (req: Request, res: Response){
        try{
            const data = req.body
            const {newsId} = req.params
            if (!newsId || isNaN(+newsId)) throw new Error("ID sent must be a number")
            const news = await this.modifyNewsUC.execute(+newsId, data)
            res.status(200).json(news)
        }
        catch(error: any){
            res.status(500).json({ error: error.message || "Server Internal Error" })
        }
    }
}