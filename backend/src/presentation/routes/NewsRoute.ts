import { Router } from "express";
import { NewsController } from "../controllers/NewsController.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import { OptionalAuthMiddleware } from "../middlewares/OptionalAuthMiddleware.js";

export function NewsRouter(){
    const newsRouter = Router()

    const newsController = new NewsController()
    
    newsRouter.get("/", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { newsController.getAll(req, res, next) }) 
    
    newsRouter.get("/title/:newsTitle", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { newsController.getByTitle(req, res, next)})

    newsRouter.delete("/:newsId", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { newsController.delete(req, res, next) }) 

    newsRouter.post("/", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { newsController.create(req, res, next) })
    
    newsRouter.patch("/:newsId", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { newsController.modify(req, res, next) }) 

    newsRouter.get("/actives", OptionalAuthMiddleware, (req, res, next) => { newsController.actives(req, res, next)})

    return newsRouter
}