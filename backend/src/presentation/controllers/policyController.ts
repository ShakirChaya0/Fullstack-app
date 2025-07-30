import { Request, Response, NextFunction } from 'express';
import { CUU25ModifyPolicys } from '../../application/use_cases/PolicyUseCases/CUU25-modifyPolicy.js';
import { GetPolicyUseCase } from '../../application/use_cases/PolicyUseCases/GetPolicyUseCase.js';
import { ValidatePolicyPartial } from '../../shared/validators/policyZod.js';

export class PolicyController {
    constructor(
        private readonly CU25ModifyPolicys = new CUU25ModifyPolicys(),
        private readonly getPolicyUseCase = new GetPolicyUseCase()
    ) {}
    public updatePoliticy = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const validation = ValidatePolicyPartial(data);

            const updatedPolitic = await this.CU25ModifyPolicys.execute(validation);
            res.status(200).json(updatedPolitic);
        } catch (error) {
            next(error);
        }
    };
    public getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const policy = await this.getPolicyUseCase.execute();
            res.status(200).json(policy);
        } catch (error) {
            next(error);
        }
    };
}