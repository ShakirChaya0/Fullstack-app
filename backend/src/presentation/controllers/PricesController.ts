import { Request, Response, NextFunction } from 'express';
import { GetPricesUseCase } from '../../application/use_cases/PricesUseCases/GetPricesUseCase.js';
import { GetOnePriceUseCase } from '../../application/use_cases/PricesUseCases/GetOnePriceUseCase.js';
import { GetPricesByProdUseCase } from '../../application/use_cases/PricesUseCases/GetPricesByProdUseCase.js';
import { DeletePriceUseCase } from '../../application/use_cases/PricesUseCases/DeletePriceUseCase.js';
import { RegisterPriceUseCase } from '../../application/use_cases/PricesUseCases/RegisterPriceUseCase.js';
import { GetActualPriceUseCase } from '../../application/use_cases/PricesUseCases/GetActualPriceUseCase.js';
import { ValidationError } from '../../shared/exceptions/ValidationError.js';
import { NotFoundError } from '../../shared/exceptions/NotFoundError.js';
import { ValidatePrice } from '../../shared/validators/PriceZod.js';

export class PricesController {
    constructor(
        private readonly getPricesUseCase = new GetPricesUseCase(),
        private readonly getOnePriceUseCase = new GetOnePriceUseCase(),
        private readonly getPricesByProdUseCase = new GetPricesByProdUseCase(),
        private readonly getActualPriceUseCase = new GetActualPriceUseCase(),
        private readonly registerPriceUseCase = new RegisterPriceUseCase(),
        private readonly deletePriceUseCase = new DeletePriceUseCase(),
    ) {}

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const prices = await this.getPricesUseCase.execute();
            res.json(prices);
        }
        catch (error) {
            next(error);
        }
    }

    public async getOne(req: Request, res: Response, next: NextFunction) {
        try {
            const { idProducto, fechaActual } = req.query;
            
            if (!idProducto || isNaN(+idProducto)) throw new ValidationError("El ID enviado debe ser un número");
            if (!fechaActual) throw new ValidationError("La fecha desde es requerida");

            const date = new Date(fechaActual as string);
            if (isNaN(date.getTime())) throw new ValidationError("Fecha inválida");

            const price = await this.getOnePriceUseCase.execute(+idProducto, date);

            if (!price) throw new NotFoundError("Precio no encontrado");
            res.json(price);
        }
        catch (error) {
            next(error);
        }
    }

    public async getByProd(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id;
            if (!productId || isNaN(+productId)) throw new ValidationError("El ID enviado debe ser un número");

            const prices = await this.getPricesByProdUseCase.execute(+productId);
            res.json(prices);
        }
        catch (error) {
            next(error);
        }
    }

    public async getActual(req: Request, res: Response, next: NextFunction) {
        try {
            const productId = req.params.id;
            if (!productId || isNaN(+productId)) throw new ValidationError("El ID enviado debe ser un número");

            const price = await this.getActualPriceUseCase.execute(+productId);
            if (!price) throw new NotFoundError("Precio no encontrado");
            res.json(price);
        }
        catch (error) {
            next(error);
        }
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        try {
            const priceData = ValidatePrice(req.body);

            if (!priceData.success) {
                const mensajes = priceData.error.errors.map(e => e.message).join(", ");
                throw new ValidationError(`${mensajes}`);
            }

            const newPrice = await this.registerPriceUseCase.execute(priceData.data);
            res.status(201).json(newPrice);
        } 
        catch (error) {
            next(error);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { idProducto, fechaActual } = req.query;

            if (!idProducto || isNaN(+idProducto)) throw new ValidationError("El ID enviado debe ser un número");
            if (!fechaActual) throw new ValidationError("La fecha desde es requerida");

            const date = new Date(fechaActual as string);
            if (isNaN(date.getTime())) throw new ValidationError("Fecha inválida");

            await this.deletePriceUseCase.execute(+idProducto, date);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
}