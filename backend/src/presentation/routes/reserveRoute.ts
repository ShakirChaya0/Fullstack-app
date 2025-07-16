import { Router } from "express";
import { ReserveController } from "../controllers/ReserveController.js";

export function ReserveRouter () {
    const reserveRouter = Router(); 
    const reserveController = new ReserveController; 

    reserveRouter.get('/fecha/:fechaHoy', (req,res,next) => {reserveController.getReserveToday(req,res,next)})

}