import { Request, Response } from "express";
import { CUU23ModifyInformation } from "../../application/use_cases/InformationUseCases/CUU23-modifyInformation.js";
import { GetInformationByIdUseCase } from "../../application/use_cases/InformationUseCases/GetInformationByIdUseCase.js";
import { ValidatePartialInformation } from "../../shared/validators/informationZod.js";

export class InformationController {
    constructor(
        private readonly CU23ModifyInformation = new CUU23ModifyInformation(),
        private readonly getInformationByIdUseCase = new GetInformationByIdUseCase()
    ) {}
    
    public updateInformation = async (req: Request, res: Response) => {
        try {
            const idInformacion = req.params.idInformacion;
            if (isNaN(+idInformacion)) {
                res.status(400).json({ error: "ID must be a number" });
            }

            const data = req.body;
            const validation = ValidatePartialInformation(data);

            const updatedInformation = await this.CU23ModifyInformation.execute(+idInformacion, validation);
            res.status(200).json(updatedInformation);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };

    public getById = async (req: Request, res: Response) => {
        try {
            const idInformacion = req.params.idInformacion;
            if (isNaN(+idInformacion)) {
                res.status(400).json({ error: "ID must be a number" });
            }

            const information = await this.getInformationByIdUseCase.execute(+idInformacion);
            res.status(200).json(information);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}