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
  
  router.get("/cliente/historial", AuthMiddleware, RoleMiddleware(["Cliente"]), controller.getByClientId);

  router.post("/", AuthMiddleware, RoleMiddleware(["Cliente"]), controller.createReservation);

  router.patch("/estado/:idReserva", AuthMiddleware, RoleMiddleware(["Mozo", "Cliente"]), controller.updateReservationStatus);
  
  return router;
};
