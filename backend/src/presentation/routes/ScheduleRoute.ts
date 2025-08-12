import { Router } from "express";
import { HorarioController } from "../controllers/ScheduleController.js";


export function HorariosRouter() {
    const horarioRouter = Router();
    const horarioController = new HorarioController();

    horarioRouter.post('/', (req, res) => {horarioController.create(req, res)});

    horarioRouter.patch('/update/:idHorario', (req, res) => {horarioController.update(req, res)});

    horarioRouter.get('/', (req, res) => { horarioController.getAll(req, res)});
    
    horarioRouter.get('/id/:idHorario', (req, res) => { horarioController.getById(req, res)});

    return horarioRouter
}