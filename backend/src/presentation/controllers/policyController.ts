import { Request, Response } from 'express';
import { CUU25ModifyPolicys } from '../../application/use_cases/PolicyUseCases/CUU25-modifyPolicy.js';
import {GetPolicyByIdUseCase} from '../../application/use_cases/PolicyUseCases/GetPoliceByIdUseCase.js';
import { ValidatePolicyPartial } from '../../shared/validators/policyZod.js';

export class PolicyController {
    constructor(
        private readonly CU25ModifyPolicys = new CUU25ModifyPolicys(),
        private readonly getPolicyByIdUseCase = new GetPolicyByIdUseCase()
    ) {}
    public updatePoliticy = async (req: Request, res: Response) => {
        try {
            const idPolitica = req.params.idPolitica;
            if (isNaN(+idPolitica)) {
                res.status(400).json({ error: 'ID must be a number' });
            }

            const data = req.body;
            const validation = ValidatePolicyPartial(data);

            const updatedPolitic = await this.CU25ModifyPolicys.execute(+idPolitica, validation);
            res.status(200).json(updatedPolitic);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
    public getById = async (req: Request, res: Response) => {
        try {
            const idPolitica = req.params.idPolitica;
            if (isNaN(+idPolitica)) {
                res.status(400).json({ error: 'ID must be a number' });
            }

            const policy = await this.getPolicyByIdUseCase.execute(+idPolitica);
            res.status(200).json(policy);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}