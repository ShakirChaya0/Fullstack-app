import { CUU10RegisterWaiter } from "../../application/use_cases/WaiterUseCases/CUU10RegisterWaiter.js";
import { CUU22ModifyWaiter } from "../../application/use_cases/WaiterUseCases/CUU22ModifyWaiter.js";
import { CUU24DeleteWaiter } from "../../application/use_cases/WaiterUseCases/CUU24_deleteWaiter.js";
import { GetWaiterByUserName } from "../../application/use_cases/WaiterUseCases/GetWaiterByUserNameUseCase.js";
import { GetWaiterById } from "../../application/use_cases/WaiterUseCases/GetWaiterByIdUseCase.js";
import { GetWaiter } from "../../application/use_cases/WaiterUseCases/GetWaitersUseCase.js";
import { Request, Response, NextFunction } from "express";
import { ValidateWaiter, ValidateWaiterPartial } from "../../shared/validators/WaiterZod.js";
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

            const filteredWaiters = {
                nombreUsuario: newWaiter.userName,
                email: newWaiter.email,
                nombre: newWaiter.nombre,
                apellido: newWaiter.apellido,
                dni: newWaiter.dni,
                telefono: newWaiter.telefono
            }
            
            res.status(201).json(filteredWaiters);
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

            const filteredWaiters = {
                nombreUsuario: updatedWaiter.userName,
                email: updatedWaiter.email,
                nombre: updatedWaiter.nombre,
                apellido: updatedWaiter.apellido,
                dni: updatedWaiter.dni,
                telefono: updatedWaiter.telefono
            }
            
            res.status(201).json(filteredWaiters);
        }
        catch (error) {
            next(error);
        }
    }
    
    public async deleteWaiter(req: Request, res: Response, next: NextFunction) {
        try {
            const waiterId = req.params.idMozo;
            if (!waiterId) {
                throw new ValidationError("Se debe ingresar un ID válido")
            }

            await this.deleteWaiterUseCase.execute(waiterId);
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    }
    
    public async getWaiterByUserName(req: Request, res: Response, next: NextFunction) {
        try {
            const { page } = req.query 
            const nombreUsuario = req.params.nombreUsuario;

            const draft = (page && !isNaN(+page)) ? +page : 1; 

            if (!nombreUsuario) throw new ValidationError("Se debe ingresar un nombre de usuario válido");

            const result = await this.getWaiterByUserNameUseCase.execute(nombreUsuario, draft);
            
            const filteredWaiters = result.Waiters.map((w) => {
                return {
                    idMozo: w.userId,
                    nombreUsuario: w.userName,
                    email: w.email,
                    nombre: w.nombre,
                    apellido: w.apellido,
                    dni: w.dni,
                    telefono: w.telefono
                }
            });
            
            res.status(200).json({Waiters: filteredWaiters, totalItems: result.totalItems, pages: result.pages});
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
            
            const filteredWaiters = {
                nombreUsuario: waiter.userName,
                email: waiter.email,
                nombre: waiter.nombre,
                apellido: waiter.apellido,
                dni: waiter.dni,
                telefono: waiter.telefono
            }
            
            res.status(200).json(filteredWaiters);
        }
        catch (error) {
            next(error);
        }
    }

    public async getWaiters(req: Request, res: Response, next: NextFunction) {
        try {
            const { page } = req.query
            const draft = (page && !isNaN(+page)) ? +page : 1
            const result = await this.getWaiterUseCase.execute(draft);
            
            const filteredWaiters = result.Waiters.map((w) => {
                return {
                    idMozo: w.userId,
                    nombreUsuario: w.userName,
                    email: w.email,
                    nombre: w.nombre,
                    apellido: w.apellido,
                    dni: w.dni,
                    telefono: w.telefono
                }
            });

            res.status(200).json({Waiters: filteredWaiters, totalItems: result.totalItems, pages: result.pages});
        }
        catch (error) {
            next(error);
        }
    }
}