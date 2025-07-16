import { Router } from "express";
import { ReservationController } from "../controllers/ReservationController.js";

export function ReservationRouter () {
    const reservationRouter = Router(); 
    const reservationController = new ReservationController; 

    reservationRouter.get('/fecha/:fechaHoy', (req,res,next) => {reservationController.getReservationToday(req,res,next)})

}