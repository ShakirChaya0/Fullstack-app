import { Router } from "express";
import { WaiterController } from "../controllers/WaiterControllers.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";

export function WaiterRouter () {
    const waiterRouter = Router();
    const waiterController = new WaiterController();
    
    waiterRouter.get("/", RoleMiddleware(["Administrador"]), (req, res, next) => { waiterController.getWaiters(req, res, next) });

    waiterRouter.get("/id/:idMozo", RoleMiddleware(["Administrador", "Mozo"]), (req, res, next) => { waiterController.getWaiterById(req, res, next) }); 
    
    waiterRouter.get("/nombre/:nombreUsuario", RoleMiddleware(["Administrador", "Mozo"]), (req, res, next) => { waiterController.getWaiterByUserName(req, res, next) });

    waiterRouter.delete("/id/:idMozo", RoleMiddleware(["Administrador"]), (req, res, next) => { waiterController.deleteWaiter(req, res, next) });

    waiterRouter.post("/", RoleMiddleware(["Administrador"]), (req, res, next) => { waiterController.createWaiter(req, res, next) });

    waiterRouter.patch("/update/:idMozo", RoleMiddleware(["Administrador", "Mozo"]), (req, res, next) => { waiterController.modifyWaiter(req, res, next) }); 

    return waiterRouter;
}