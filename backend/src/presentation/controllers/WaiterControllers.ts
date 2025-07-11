import { CUU10RegisterWaiter } from "../../application/use_cases/WaiterUseCases/CUU10_registerWaiter.js";
import { CUU22ModifyWaiter } from "../../application/use_cases/WaiterUseCases/CUU22_modifyWaiter.js";
import { CUU24DeleteWaiter } from "../../application/use_cases/WaiterUseCases/CUU24_deleteWaiter.js";
import { GetWaiterByUserName } from "../../application/use_cases/WaiterUseCases/GetWaiterByUserNameUseCase.js";
import { GetWaiterById } from "../../application/use_cases/WaiterUseCases/GetWaiterByIdUseCase.js";
import { GetWaiter } from "../../application/use_cases/WaiterUseCases/GetWaitersUseCase.js";
import { Request, Response, NextFunction } from "express";
import { ValidateWaiter, ValidateWaiterPartial } from "../../shared/validators/waiterZod.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";

export class WaiterController {
    constructor(
        private readonly registerWaiterUseCase = new CUU10RegisterWaiter(),
        private readonly modifyWaiterUseCase = new CUU22ModifyWaiter(),
        private readonly deleteWaiterUseCase = new CUU24DeleteWaiter(),
        private readonly getWaiterByUserNameUseCase = new GetWaiterByUserName(),
        private readonly getWaiterByIdUseCase = new GetWaiterById(),
        private readonly getWaiterUseCase = new GetWaiter()
    ) {}
    
    public async createWaiter(req: Request, res: Response, next: NextFunction) {
        try {
            const data = req.body;
            const validation = ValidateWaiter(data);

            const newWaiter = await this.registerWaiterUseCase.execute(validation);

            res.status(201).json(newWaiter);
        }
        catch (error) {
            next(error);
        }
    }

    public async modifyWaiter(req: Request, res: Response, next: NextFunction) {
        try {
            const waiterId = req.params.idMozo;
            if (!waiterId) {
                throw new ValidationError("Se ingresar un ID válido")
            }

            const data = req.body;
            const validation = ValidateWaiterPartial(data);

            const updatedWaiter = await this.modifyWaiterUseCase.execute(waiterId, validation);

            res.status(200).json(updatedWaiter);
        }
        catch (error) {
            next(error);
        }
    }
    
    public async deleteWaiter(req: Request, res: Response, next: NextFunction) {
        try {
            const waiterId = req.params.idMozo;
            if (!waiterId) {
                throw new ValidationError("Se ingresar un ID válido")
            }

            const deletedWaiter = await this.deleteWaiterUseCase.execute(waiterId);
            res.status(200).json(deletedWaiter);
        }
        catch (error) {
            next(error);
        }
    }
    
    public async getWaiterByUserName(req: Request, res: Response, next: NextFunction) {
        try {
            const nombreUsuario = req.params.nombreUsuario;
            if (!nombreUsuario) {
                throw new ValidationError("Se debe ingresar un nombre de usuario válido")
            }
            const validation = ValidateWaiterPartial({ nombreUsuario });

            const waiter = await this.getWaiterByUserNameUseCase.execute(validation.nombreUsuario || null);
            res.status(200).json(waiter);
        }
        catch (error) {
            next(error);
        }

    }
    public async getWaiterById(req: Request, res: Response, next: NextFunction) {
        try {
            const waiterId = req.params.idMozo;
            if (!waiterId) {
                throw new ValidationError("Se ingresar un ID válido")
            }

            const waiter = await this.getWaiterByIdUseCase.execute(waiterId);
            res.status(200).json(waiter);
        }
        catch (error) {
            next(error);
        }
    }
    public async getWaiters(req: Request, res: Response, next: NextFunction) {
        try {
            const waiters = await this.getWaiterUseCase.execute();
            res.status(200).json(waiters);
        }
        catch (error) {
            next(error);
        }
    }
}