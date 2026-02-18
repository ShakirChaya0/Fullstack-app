import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

export function PaymentRouter () {
    const paymentRouter = Router();
    const paymentController = new PaymentController();

    paymentRouter.get("/", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { paymentController.getAll(req, res, next) });

    paymentRouter.get("/pedido/:idPedido", AuthMiddleware, RoleMiddleware(["Administrador", "Mozo"]), (req, res, next) => { paymentController.getByOrder(req, res, next) });
    
    paymentRouter.get("/fechas", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { paymentController.getByDateRange(req, res, next) });
    
    paymentRouter.get("/metodoPago/:metodoPago", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { paymentController.getByPaymentMethod(req, res, next) });
    
    paymentRouter.get("/cuenta/:id", (req, res, next) => { paymentController.generateCheck(req, res, next) });

    paymentRouter.post("/mp/:id", (req, res, next) => { paymentController.payWithMercadoPago(req, res, next) });

    paymentRouter.post("/efectivo/:id", (req, res, next) => { paymentController.payInCashOrCard(req, res, next) });

    paymentRouter.post("/tarjeta/:id", (req, res, next) => { paymentController.payInCashOrCard(req, res, next) });
    
    paymentRouter.post("/pagado", (req, res, next) => { paymentController.registerPayment(req, res, next) });

    return paymentRouter;
}