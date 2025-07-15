import { Request, Response, NextFunction } from "express";
import { GetAdminUseCase } from "../../application/use_cases/AdminUseCases/GetAdminUseCase.js";
import { UpdateAdminProfileUseCase } from "../../application/use_cases/AdminUseCases/UpdateAdminProfileUseCase.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { ValidatePartialAdmin } from "../../shared/validators/adminZod.js";
import { PartialSchemaAdmin } from "../../shared/validators/adminZod.js";
import { NotFoundError } from "../../shared/exceptions/NotFoundError.js";


export class AdminController {
    constructor(
        private readonly getAdminUseCase = new GetAdminUseCase(),
        private readonly updateAdminProfileUseCase = new UpdateAdminProfileUseCase()
    ) {}

    public getAdmin = async (req: Request, res:Response, next: NextFunction) => {
        try {
            const admin = await this.getAdminUseCase.execute();
            res.status(200).json(admin);
        }catch(error){
            next(error);
        }
    }

    public updateAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idAdmin = req.params.idAdmin;
            if(!idAdmin) throw new ValidationError('El id del Administrador no puede ser vacio');

            const data = req.body;
            const dataValidada = ValidatePartialAdmin(data);
            
            const adminActualizar: PartialSchemaAdmin = dataValidada;

            const admin = await this.updateAdminProfileUseCase.execute(idAdmin, adminActualizar);
            if(!admin) throw new NotFoundError('Administrador no encontrado');
            res.status(200).json(admin);
        } catch (error) {
            next(error);
        }
    }
}
