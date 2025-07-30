import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController.js";

export function PaymentRouter () {
    const paymentRouter = Router();
    const paymentController = new PaymentController();
    
    paymentRouter.get("/cuenta/:id", (req, res, next) => { paymentController.generateCheck(req, res, next) });

    paymentRouter.post("/mp/:id", (req, res, next) => { paymentController.payWithMercadoPago(req, res, next) });

    paymentRouter.post("/efectivo/:id", (req, res, next) => { paymentController.payInCashOrCard(req, res, next) });

    paymentRouter.post("/tarjeta/:id", (req, res, next) => { paymentController.payInCashOrCard(req, res, next) });
    
    paymentRouter.post("/pagado/:id", (req, res, next) => { paymentController.registerPayment(req, res, next) });

    return paymentRouter;
}