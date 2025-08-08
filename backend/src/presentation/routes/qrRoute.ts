import { Router } from "express";
import { QRController } from "../controllers/QRController.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";


export function QrRoute(){
    const qrRouter = Router();
    const qrController = new QRController();

    qrRouter.post("/", RoleMiddleware(["Mozo"]), (req, res, next) => { qrController.createOrUpdate(req, res, next) });
    
    return qrRouter
}