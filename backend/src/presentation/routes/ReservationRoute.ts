import { Router } from "express";
import { ReservationController } from "../controllers/ReservationController.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

export const ReservationRouter = () => {
  const router = Router();
  const controller = new ReservationController();
  
  router.get("/clienteReserva", AuthMiddleware, RoleMiddleware(["Mozo"]), controller.getReservationByNameClient);
  
  router.get("/:idReserva", controller.getById);
  
  router.get("/", AuthMiddleware, RoleMiddleware(["Mozo"]), controller.getByDate);
  
  router.get("/cliente/:clientId", controller.getByClientId);

  router.post("/", AuthMiddleware, RoleMiddleware(["Cliente"]), controller.createReservation);

  router.patch("/estado", AuthMiddleware, RoleMiddleware(["Mozo"]), controller.updateReservationStatus);
  
  return router;
};
