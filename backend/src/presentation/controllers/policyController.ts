import { Request, Response } from 'express';
import { CUU25ModifyPoliticys } from '../../application/use_cases/PolicyUseCases/CUU25-modifyPoliticys.js';
import { SchemaPoliticy } from '../validators/policyZod.js';
import { ValidatePolticyPartial } from '../validators/policyZod.js';

export class PoliticyController {
    static updatePoliticy = async (req: Request, res: Response) => {
        try {
            const idPolitica = req.params.idPolitica;
            if (isNaN(+idPolitica)) {
                return res.status(400).json({ error: 'ID must be a number' });
            }

            const data = req.body;
            const validation = ValidatePolticyPartial(data);
            if (!validation.success) {
                return res.status(400).json({ error: validation.error.errors });
            }

            const updatedPolitic = await CUU25ModifyPoliticys.execute(+idPolitica, data as SchemaPoliticy);
            res.status(200).json(updatedPolitic);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    };
}
