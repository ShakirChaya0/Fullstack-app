import { CUU10RegisterWaiter } from "../../application/use_cases/WaiterUseCases/CUU10_registerWaiter.js";
import { CUU22ModifyWaiter } from "../../application/use_cases/WaiterUseCases/CUU22_modifyWaiter.js";
import { CUU24DeleteWaiter } from "../../application/use_cases/WaiterUseCases/CUU24_deleteWaiter.js";
import { GetWaiterByUserName } from "../../application/use_cases/WaiterUseCases/GetWaiterByUserNameUseCase.js";
import { GetWaiterById } from "../../application/use_cases/WaiterUseCases/GetWaiterByIdUseCase.js";
import { GetWaiter } from "../../application/use_cases/WaiterUseCases/GetWaitersUseCase.js";
import { Request, Response } from "express";
import { ValidateWaiter, ValidateWaiterPartial } from "../../shared/validators/waiterZod.js";

export class WaiterController {
    constructor(
        private readonly registerWaiterUseCase = new CUU10RegisterWaiter(),
        private readonly modifyWaiterUseCase = new CUU22ModifyWaiter(),
        private readonly deleteWaiterUseCase = new CUU24DeleteWaiter(),
        private readonly getWaiterByUserNameUseCase = new GetWaiterByUserName(),
        private readonly getWaiterByIdUseCase = new GetWaiterById(),
        private readonly getWaiterUseCase = new GetWaiter()
    ) {}
    
    public async createWaiter(req: Request, res: Response) {
        try {
            const data = req.body;
            const validation = ValidateWaiter(data);

            const newWaiter = await this.registerWaiterUseCase.execute(validation);

            res.status(201).json(newWaiter);
        }
        catch (error: any) {
            res.status(500).json({ error: error.message || "Error al crear el camarero" });
        }
    }

    public async modifyWaiter(req: Request, res: Response) {
        try {
            const waiterId = req.params.idMozo;
            if (!waiterId) {
                res.status(400).json({ error: "El id es inválido" });
            }

            const data = req.body;
            const validation = ValidateWaiterPartial(data);

            const updatedWaiter = await this.modifyWaiterUseCase.execute(waiterId, validation);

            res.status(200).json(updatedWaiter);
        }
        catch (error: any) {
            res.status(500).json({ error: error.message || "Error al modificar el camarero" });
        }
    }
    
    public async deleteWaiter(req: Request, res: Response) {
        try {
            const waiterId = req.params.idMozo;
            if (!waiterId) {
                res.status(400).json({ error: "El id es inválido" });
            }

            const deletedWaiter = await this.deleteWaiterUseCase.execute(waiterId);
            res.status(200).json(deletedWaiter);
        }
        catch (error: any) {
            res.status(500).json({ error: error.message || "Error al eliminar el Mozo" });
        }
    }
    
    public async getWaiterByUserName(req: Request, res: Response) {
        try {
            const nombreUsuario = req.params.nombreUsuario;
            if (!nombreUsuario) {
                res.status(400).json({ error: "El nombre de usuario es requerido" });
            }
            const validation = ValidateWaiterPartial({ nombreUsuario });

            const waiter = await this.getWaiterByUserNameUseCase.execute(validation.nombreUsuario || null);
            res.status(200).json(waiter);
        }
        catch (error: any) {
            res.status(500).json({ error: error.message || "Error al obtener el camarero por nombre de usuario" });
        }

    }
    public async getWaiterById(req: Request, res: Response) {
        try {
            const waiterId = req.params.idMozo;
            if (!waiterId) {
                res.status(400).json({ error: "El id es inválido" });
            }

            const waiter = await this.getWaiterByIdUseCase.execute(waiterId);
            res.status(200).json(waiter);
        }
        catch (error: any) {
            res.status(500).json({ error: error.message || "Error al obtener el camarero por ID" });
        }
    }
    public async getWaiters(req: Request, res: Response) {
        try {
            const waiters = await this.getWaiterUseCase.execute();
            res.status(200).json(waiters);
        }
        catch (error: any) {
            res.status(500).json({ error: error.message || "Error al obtener los camareros" });
        }
    }
}