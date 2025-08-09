import { Router } from "express";
import { ReservationController } from "../controllers/ReservationController.js";

export const ReservationRouter = () => {
  const router = Router();
  const controller = new ReservationController();
  
  router.get("/clienteReserva", controller.getReservationByNameClient);

  router.post("/:idCliente", controller.createReservation);

  router.patch("/estado/:idReserva", controller.updateReservationStatus);

  router.get("/:idReserva", controller.getById);

  router.get("/", controller.getByDate);

  router.get("/cliente/:clientId", controller.getByClientId);
  

  return router;
};
