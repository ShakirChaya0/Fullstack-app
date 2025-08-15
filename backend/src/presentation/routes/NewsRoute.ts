import { Router } from "express";
import { NewsController } from "../controllers/NewsController.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";


export function NewsRouter(){
    const newsRouter = Router()

    const newsController = new NewsController()

    newsRouter.get("/", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => {newsController.getAll(req, res, next)})

    newsRouter.get("/actives/", (req, res, next) => {newsController.getActives(req, res, next)})
    
    newsRouter.get("/id/:newsId", (req, res, next) => {newsController.getOne(req, res, next)})

    newsRouter.delete("/:newsId", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => {newsController.delete(req, res, next)})

    newsRouter.post("/", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => {newsController.create(req, res, next)})
    
    newsRouter.patch("/:newsId", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => {newsController.modify(req, res, next)})

    return newsRouter
}