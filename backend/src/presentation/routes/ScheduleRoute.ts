import { Router } from "express";
import { HorarioController } from "../controllers/ScheduleController.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";


export function HorariosRouter() {
    const horarioRouter = Router();
    const horarioController = new HorarioController();

    horarioRouter.get('/', (req, res, next) => { horarioController.getAll(req, res, next) });
    
    horarioRouter.get('/id/:diaSemana', (req, res, next) => { horarioController.getById(req, res, next) });

    horarioRouter.post('/', AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { horarioController.create(req, res, next) });

    horarioRouter.patch('/update/:diaSemana', AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { horarioController.update(req, res, next) });

    return horarioRouter;
}