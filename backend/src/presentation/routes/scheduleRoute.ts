import { Router } from "express";
import { HorarioController } from "../controllers/scheduleController.js";


export function horariosRouter() {
    const horarioRouter = Router();
    const horarioController = new HorarioController(); //Importar

    // horarioRouter.post('/', (req, res) => {horarioController.create(req, res)});

    // horarioRouter.put('/update/:idHorario', (req, res) => {horarioController.modify(req, res)});

    horarioRouter.get('/', (req, res) => { horarioController.getAll(req, res)});
    
    horarioRouter.get('/id/:idHorario', (req, res) => { horarioController.getById(req, res)});

    return horarioRouter
}