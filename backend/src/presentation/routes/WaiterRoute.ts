import { Router } from "express";
import { WaiterController } from "../controllers/WaiterControllers.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";

export function WaiterRouter () {
    const waiterRouter = Router();
    const waiterController = new WaiterController();
    
    waiterRouter.get("/", RoleMiddleware(["Administrador"]), (req, res, next) => { waiterController.getWaiters(req, res, next) }); // RoleMiddleware(["Administrador"])

    waiterRouter.get("/id/:idMozo", (req, res, next) => { waiterController.getWaiterById(req, res, next) }); // RoleMiddleware(["Administrador", "Mozo"])
    
    waiterRouter.get("/nombre/:nombreUsuario", (req, res, next) => { waiterController.getWaiterByUserName(req, res, next) }); // RoleMiddleware(["Administrador", "Mozo"])

    waiterRouter.delete("/id/:idMozo", (req, res, next) => { waiterController.deleteWaiter(req, res, next) }); // RoleMiddleware(["Administrador"])

    waiterRouter.post("/", (req, res, next) => { waiterController.createWaiter(req, res, next) }); // RoleMiddleware(["Administrador"])

    waiterRouter.patch("/update/:idMozo", RoleMiddleware(["Administrador", "Mozo"]), (req, res, next) => { waiterController.modifyWaiter(req, res, next) }); 

    return waiterRouter;
}