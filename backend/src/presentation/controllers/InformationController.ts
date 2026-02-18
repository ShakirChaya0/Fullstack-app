import { Request, Response, NextFunction } from "express";
import { CUU23ModifyInformation } from "../../application/use_cases/InformationUseCases/CUU23ModifyInformation.js";
import { GetInformationUseCase } from "../../application/use_cases/InformationUseCases/GetInformationUseCase.js";
import { ValidatePartialInformation } from "../../shared/validators/InformationZod.js";

export class InformationController {
    constructor(
        private readonly CU23ModifyInformation = new CUU23ModifyInformation(),
        private readonly getInformationUseCase = new GetInformationUseCase()
    ) {}
    
    public updateInformation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const validation = ValidatePartialInformation(data);

            const updatedInformation = await this.CU23ModifyInformation.execute(validation);
            res.status(200).json(updatedInformation);
        } catch (error) {
            next(error);
        }
    };

    public getInformation = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const information = await this.getInformationUseCase.execute();
            res.status(200).json(information);
        } catch (error) {
            next(error);
        }
    };
}