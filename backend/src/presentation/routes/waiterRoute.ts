import { Router } from "express";
import { WaiterController } from "../controllers/WaiterControllers.js";

export function WaiterRouter () {
    const waiterRouter = Router();
    const waiterController = new WaiterController();
    
    waiterRouter.get("/", (req, res) => { waiterController.getWaiters(req, res) });

    waiterRouter.get("/id/:idMozo", (req, res) => { waiterController.getWaiterById(req, res) });
    
    waiterRouter.get("/nombre/:nombreUsuario", (req, res) => { waiterController.getWaiterByUserName(req, res) });

    waiterRouter.delete("/id/:idMozo", (req, res) => { waiterController.deleteWaiter(req, res) });

    waiterRouter.post("/", (req, res) => { waiterController.createWaiter(req, res) });

    waiterRouter.patch("/id/:idMozo", (req, res) => { waiterController.modifyWaiter(req, res) });

    return waiterRouter;
}