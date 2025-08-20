import { Router } from "express";
import { NewsController } from "../controllers/NewsController.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";


export function NewsRouter(){
    const newsRouter = Router()

    const newsController = new NewsController()
    
    // SE ELIMINA LOS MIDDLEWARES PARA FACILITAR TESTEO

    newsRouter.get("/", (req, res, next) => {newsController.getAll(req, res, next)}) // AuthMiddleware, RoleMiddleware(["Administrador"])

    newsRouter.get("/actives/", (req, res, next) => {newsController.getActives(req, res, next)})
    
    newsRouter.get("/id/:newsId", (req, res, next) => {newsController.getOne(req, res, next)})

    newsRouter.delete("/:newsId", (req, res, next) => {newsController.delete(req, res, next)}) //AuthMiddleware, RoleMiddleware(["Administrador"])

    newsRouter.post("/", (req, res, next) => {newsController.create(req, res, next)}) //AuthMiddleware, RoleMiddleware(["Administrador"]),
    
    newsRouter.patch("/:newsId", (req, res, next) => {newsController.modify(req, res, next)}) //AuthMiddleware, RoleMiddleware(["Administrador"])

    return newsRouter
}