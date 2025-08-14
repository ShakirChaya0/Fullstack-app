import { Router } from "express";
import { HorarioController } from "../controllers/ScheduleController.js";


export function HorariosRouter() {
    const horarioRouter = Router();
    const horarioController = new HorarioController();

    horarioRouter.post('/', (req, res, next) => { horarioController.create(req, res, next) });

    horarioRouter.patch('/update/:diaSemana', (req, res, next) => { horarioController.update(req, res, next) });

    horarioRouter.get('/', (req, res, next) => { horarioController.getAll(req, res, next) });
    
    horarioRouter.get('/id/:diaSemana', (req, res, next) => { horarioController.getById(req, res, next) });

    return horarioRouter;
}