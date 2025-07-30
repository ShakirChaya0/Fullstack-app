import { Router } from "express";
import { ReservationController } from "../controllers/ReservationController.js";

export const ReservationRouter = () => {
  const router = Router();
  const controller = new ReservationController();

  router.post("/:idCliente", controller.createReservation);

  router.patch("/:idReserva", controller.updateReservationStatus);

  router.get("/:idReserva", controller.getById);

  router.get("/", controller.getByDate);

  router.get("/cliente/:clientId", controller.getByClientId);
  
  router.get("/",controller.getReservationByNameClient)

  return router;
};
