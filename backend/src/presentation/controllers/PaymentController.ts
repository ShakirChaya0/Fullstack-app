import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { GenerateCheckUseCase } from "../../application/use_cases/OrderUseCases/GenerateCheckUseCase.js";
import { RegisterPaymentUseCase } from "../../application/use_cases/OrderUseCases/RegisterPaymentUseCase.js";
import { SetToWaitingForChargeUseCase } from "../../application/use_cases/OrderUseCases/SetToWaitingForChargeUseCase.js";

export class PaymentController {
    constructor(
        private readonly generateCheckUseCase = new GenerateCheckUseCase(),
        private readonly registerPaymentUseCase = new RegisterPaymentUseCase(),
        private readonly setToWaitingForChargeUseCase = new SetToWaitingForChargeUseCase(),
    ) {}

    public async generateCheck(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = req.params.id;
            if (!orderId || isNaN(+orderId)) throw new ValidationError("El ID enviado debe ser un número");
            
            const check = await this.generateCheckUseCase.execute(+orderId);
            res.status(200).json(check);
        }
        catch (err) {
            next(err);
        }
    }

    public async payWithMercadoPago(req: Request, res: Response, next: NextFunction) {
        try {
            // {
            //     backurls: {
            //         success: `pagos/pagado/${order.idPedido}`
            //     }
            // }
        }
        catch (err) {
            next(err);
        }
    }

    public async payInCashOrCard(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = req.params.id;
            if (!orderId || isNaN(+orderId)) throw new ValidationError("El ID enviado debe ser un número");

            await this.setToWaitingForChargeUseCase.execute(+orderId);
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    }

    public async registerPayment(req: Request, res: Response, next: NextFunction) {
        try {
            const orderId = req.params.id;
            if (!orderId || isNaN(+orderId)) throw new ValidationError("El ID enviado debe ser un número");

            await this.registerPaymentUseCase.execute(+orderId);
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    }
}
