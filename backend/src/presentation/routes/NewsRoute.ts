import { Router } from "express";
import { NewsController } from "../controllers/NewsController.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";

export function NewsRouter(){
    const newsRouter = Router()

    const newsController = new NewsController()
    
    newsRouter.get("/", RoleMiddleware(["Administrador"]), (req, res, next) => { newsController.getAll(req, res, next) }) 
    
    newsRouter.get("/title/:newsTitle", RoleMiddleware(["Administrador"]), (req, res, next) => { newsController.getByTitle(req, res, next)})

    newsRouter.delete("/:newsId", RoleMiddleware(["Administrador"]), (req, res, next) => { newsController.delete(req, res, next) }) 

    newsRouter.post("/", RoleMiddleware(["Administrador"]), (req, res, next) => { newsController.create(req, res, next) })
    
    newsRouter.patch("/:newsId", RoleMiddleware(["Administrador"]), (req, res, next) => { newsController.modify(req, res, next) }) 

    return newsRouter
}