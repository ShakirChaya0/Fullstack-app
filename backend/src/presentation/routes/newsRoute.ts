import { Router } from "express";
import { NewsController } from "../controllers/NewsController.js";


export function NewsRouter(){
    const newsRouter = Router()

    const newsController = new NewsController()

    newsRouter.post("/", (req, res, next) => {newsController.create(req, res, next)})
    
    newsRouter.patch("/update/:newsId", (req, res, next) => {newsController.modify(req, res, next)})

    return newsRouter
}