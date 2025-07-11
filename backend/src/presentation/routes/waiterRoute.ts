import { Router } from "express";
import { WaiterController } from "../controllers/WaiterControllers.js";

export function WaiterRouter () {
    const waiterRouter = Router();
    const waiterController = new WaiterController();
    
    waiterRouter.get("/", (req, res, next) => { waiterController.getWaiters(req, res, next) });

    waiterRouter.get("/id/:idMozo", (req, res, next) => { waiterController.getWaiterById(req, res, next) });
    
    waiterRouter.get("/nombre/:nombreUsuario", (req, res, next) => { waiterController.getWaiterByUserName(req, res, next) });

    waiterRouter.delete("/id/:idMozo", (req, res, next) => { waiterController.deleteWaiter(req, res, next) });

    waiterRouter.post("/", (req, res, next) => { waiterController.createWaiter(req, res, next) });

    waiterRouter.patch("/id/:idMozo", (req, res, next) => { waiterController.modifyWaiter(req, res, next) });

    return waiterRouter;
}