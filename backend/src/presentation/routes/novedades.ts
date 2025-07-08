import { Router } from "express";
import { NewsController } from "../controllers/NewsController.js";


export function NewsRouter(){
    const newsRouter = Router()

    const newsController = new NewsController()

    newsRouter.post("/", (req, res) => {newsController.create(req, res)})
    
    newsRouter.post("/update/:newsId", (req, res) => {newsController.modify(req, res)})

    return newsRouter
}