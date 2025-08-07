import { Router } from "express";
import { PaymentController } from "../controllers/PaymentController.js";

export function PaymentRouter () {
    const paymentRouter = Router();
    const paymentController = new PaymentController();

    paymentRouter.get("/", (req, res, next) => { paymentController.getAll(req, res, next) });

    paymentRouter.get("/pedido/:idPedido", (req, res, next) => { paymentController.getByOrder(req, res, next) });
    
    paymentRouter.get("/fechas", (req, res, next) => { paymentController.getByDateRange(req, res, next) });
    
    paymentRouter.get("/metodoPago/:metodoPago", (req, res, next) => { paymentController.getByPaymentMethod(req, res, next) });
    
    paymentRouter.get("/cuenta/:id", (req, res, next) => { paymentController.generateCheck(req, res, next) });

    paymentRouter.post("/mp/:id", (req, res, next) => { paymentController.payWithMercadoPago(req, res, next) });

    paymentRouter.post("/efectivo/:id", (req, res, next) => { paymentController.payInCashOrCard(req, res, next) });

    paymentRouter.post("/tarjeta/:id", (req, res, next) => { paymentController.payInCashOrCard(req, res, next) });
    
    paymentRouter.post("/pagado", (req, res, next) => { paymentController.registerPayment(req, res, next) });

    return paymentRouter;
}