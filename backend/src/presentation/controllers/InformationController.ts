import { Request, Response, NextFunction } from "express";
import { CUU23ModifyInformation } from "../../application/use_cases/InformationUseCases/CUU23-modifyInformation.js";
import { GetInformationByIdUseCase } from "../../application/use_cases/InformationUseCases/GetInformationByIdUseCase.js";
import { ValidatePartialInformation } from "../../shared/validators/informationZod.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";

export class InformationController {
    constructor(
        private readonly CU23ModifyInformation = new CUU23ModifyInformation(),
        private readonly getInformationByIdUseCase = new GetInformationByIdUseCase()
    ) {}
    
    public updateInformation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idInformacion = req.params.idInformacion;
            if (isNaN(+idInformacion)) {
                throw new ValidationError("El ID ingresado debe ser un número");
            }

            const data = req.body;
            const validation = ValidatePartialInformation(data);

            const updatedInformation = await this.CU23ModifyInformation.execute(+idInformacion, validation);
            res.status(200).json(updatedInformation);
        } catch (error) {
            next(error);
        }
    };

    public getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idInformacion = req.params.idInformacion;
            if (isNaN(+idInformacion)) {
                throw new ValidationError("El ID ingresado debe ser un número");
            }

            const information = await this.getInformationByIdUseCase.execute(+idInformacion);
            res.status(200).json(information);
        } catch (error) {
            next(error);
        }
    };
}