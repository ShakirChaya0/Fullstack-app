import { Router} from 'express';
import { PolicyController } from '../controllers/policyController.js';

export function PolicyRouter() {
    const policyRouter = Router();
    const policyController = new PolicyController();

    policyRouter.patch('/id/:idPolitica', (req, res) => { 
        policyController.updatePoliticy(req, res); 
    });

    policyRouter.get('/id/:idPolitica', (req, res) => { 
        policyController.getById(req, res); 
    });

    return policyRouter;
}
