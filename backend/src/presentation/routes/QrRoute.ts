import { Router } from "express";
import { QRController } from "../controllers/QRController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";

export function QrRoute(){
    const qrRouter = Router();
    const qrController = new QRController();

    qrRouter.get("/:nroMesa", (req, res, next) => { qrController.getQrTokenByTable(req, res, next) });

    qrRouter.post("/", AuthMiddleware, RoleMiddleware(["Mozo"]), (req, res, next) => { qrController.createOrUpdate(req, res, next) });
    
    return qrRouter
}