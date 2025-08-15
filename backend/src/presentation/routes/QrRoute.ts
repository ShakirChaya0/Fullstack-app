import { Router } from "express";
import { QRController } from "../controllers/QRController.js";

export function QrRoute(){
    const qrRouter = Router();
    const qrController = new QRController();

    qrRouter.post("/", (req, res, next) => { qrController.createOrUpdate(req, res, next) });
    
    return qrRouter
}