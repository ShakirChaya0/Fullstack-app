import { Request, Response, NextFunction } from 'express';
import { CUU25ModifyPolicys } from '../../application/use_cases/PolicyUseCases/CUU25-modifyPolicy.js';
import { GetPolicyByIdUseCase } from '../../application/use_cases/PolicyUseCases/GetPoliceByIdUseCase.js';
import { ValidatePolicyPartial } from '../../shared/validators/policyZod.js';
import { ValidationError } from '../../shared/exceptions/ValidationError.js';

export class PolicyController {
    constructor(
        private readonly CU25ModifyPolicys = new CUU25ModifyPolicys(),
        private readonly getPolicyByIdUseCase = new GetPolicyByIdUseCase()
    ) {}
    public updatePoliticy = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idPolitica = req.params.idPolitica;
            if (isNaN(+idPolitica)) {
                throw new ValidationError("El ID de la política debe ser un número");
            }

            const data = req.body;
            const validation = ValidatePolicyPartial(data);

            const updatedPolitic = await this.CU25ModifyPolicys.execute(+idPolitica, validation);
            res.status(200).json(updatedPolitic);
        } catch (error) {
            next(error);
        }
    };
    public getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idPolitica = req.params.idPolitica;
            if (isNaN(+idPolitica)) {
                throw new ValidationError("El ID ingresado debe ser un número");
            }

            const policy = await this.getPolicyByIdUseCase.execute(+idPolitica);
            res.status(200).json(policy);
        } catch (error) {
            next(error);
        }
    };
}