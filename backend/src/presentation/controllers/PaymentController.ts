import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { GenerateCheckUseCase } from "../../application/use_cases/OrderUseCases/GenerateCheckUseCase.js";
import { RegisterPaymentUseCase } from "../../application/use_cases/OrderUseCases/RegisterPaymentUseCase.js";
import { SetToWaitingForChargeUseCase } from "../../application/use_cases/OrderUseCases/SetToWaitingForChargeUseCase.js";
import { GetAllPaymentUseCase } from "../../application/use_cases/PaymentUseCases/GetAllPaymentsUseCase.js";
import { GetByOrderUseCase } from "../../application/use_cases/PaymentUseCases/GetByOrderUseCase.js";
import { GetByDateRange } from "../../application/use_cases/PaymentUseCases/GetByDateRangeUseCase.js";
import { GetByPaymentMethod } from "../../application/use_cases/PaymentUseCases/GetByPaymentMethodUseCase.js";
import { NotFoundError } from "../../shared/exceptions/NotFoundError.js";
import { PayWithMercadoPagoUseCase } from "../../application/use_cases/OrderUseCases/PayWithMercadoPagoUseCase.js";
import { mercadoPagoClient } from "../../infrastructure/config/MercadoPago.js";
import { Payment } from "mercadopago";
import { OrderSocketService } from "../../application/services/OrderSocketService.js";

export class PaymentController {
    constructor(
        private readonly getAllUseCase = new GetAllPaymentUseCase(),
        private readonly getByOrderUseCase = new GetByOrderUseCase(),
        private readonly getByDateRangeUseCase = new GetByDateRange(),
        private readonly getByPaymentMethodUseCase = new GetByPaymentMethod(),
        private readonly generateCheckUseCase = new GenerateCheckUseCase(),
        private readonly registerPaymentUseCase = new RegisterPaymentUseCase(),
        private readonly setToWaitingForChargeUseCase = new SetToWaitingForChargeUseCase(),
        private readonly payWithMPUseCase = new PayWithMercadoPagoUseCase(),
        private readonly orderSocketService = new OrderSocketService()
    ) {}

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const payments = await this.getAllUseCase.execute();
            res.status(200).json(payments);
        }
        catch (err) {
            next(err);
        }
    }

    public async getByOrder(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = req.params.idPedido;
            if (!orderId || isNaN(+orderId)) throw new ValidationError("El ID enviado debe ser un número");

            const payment = await this.getByOrderUseCase.execute(+orderId);
            if (!payment) throw new NotFoundError("Pago no encontrado");
            
            res.status(200).json(payment);
        }
        catch (err) {
            next(err);
        }
    }

    public async getByDateRange(req: Request, res: Response, next: NextFunction) {
        try {
            const { fechaDesde, fechaHasta } = req.query;
            
            const dateFrom = new Date(fechaDesde as string);
            if (isNaN(dateFrom.getTime())) throw new ValidationError("Fecha Desde inválida");
            const dateTo = new Date(fechaHasta as string);
            if (isNaN(dateTo.getTime())) throw new ValidationError("Fecha Hasta inválida");

            const payments = await this.getByDateRangeUseCase.execute(dateFrom, dateTo);
            res.status(200).json(payments);
        }
        catch (err) {
            next(err);
        }
    }

    public async getByPaymentMethod(req: Request, res: Response, next: NextFunction) {
        try {
            const paymentMethod = req.params.metodoPago;
            
            if (paymentMethod !== "MercadoPago" && paymentMethod !== "Efectivo" && paymentMethod !== "Debito" && paymentMethod !== "Credito") 
                throw new ValidationError("Método de pago inválido");

            const payments = await this.getByPaymentMethodUseCase.execute(paymentMethod);
            res.status(200).json(payments);
        }
        catch (err) {
            next(err);
        }
    }

    public async generateCheck(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = req.params.id;
            if (!orderId || isNaN(+orderId)) throw new ValidationError("El ID enviado debe ser un número");
            
            const { order, check } = await this.generateCheckUseCase.execute(+orderId);

            await this.orderSocketService.emitOrderEvent("orderPaymentEvent", order);

            res.status(200).json(check);
        }
        catch (err) {
            next(err);
        }
    }

    public async payWithMercadoPago(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = req.params.id
            if (!orderId || isNaN(+orderId)) throw new ValidationError("El ID enviado debe ser un número");

            const preference = await this.payWithMPUseCase.execute(+orderId)
            res.status(200).json({ redirect_url: preference.init_point})
        }
        catch (err) {
            next(err);
        }
    }

    public async payInCashOrCard(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = req.params.id;
            if (!orderId || isNaN(+orderId)) throw new ValidationError("El ID enviado debe ser un número");

            const order = await this.setToWaitingForChargeUseCase.execute(+orderId);

            await this.orderSocketService.emitOrderEvent("orderPaymentEvent", order);

            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    }

    public async registerPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const {id, topic} = req.query
            let order;
            if (topic && topic == "payment") {
                const payment = await new Payment(mercadoPagoClient).get({ id: Number(id) });

                const {orderId, metodoPago} = JSON.parse(payment.external_reference!); 

                order = await this.registerPaymentUseCase.execute(orderId, metodoPago, `${payment.id}`)
            }
            else{
                const { idPedido, metodoPago } = req.query;
                if (!idPedido || isNaN(+idPedido)) throw new ValidationError("El ID enviado debe ser un número");
                if (metodoPago !== "MercadoPago" && metodoPago !== "Efectivo" && metodoPago !== "Debito" && metodoPago !== "Credito") 
                    throw new ValidationError("Método de pago inválido");
    
                order = await this.registerPaymentUseCase.execute(+idPedido, metodoPago, null);
            }

            await this.orderSocketService.emitOrderEvent("orderPaymentEvent", order);

            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    }
}
