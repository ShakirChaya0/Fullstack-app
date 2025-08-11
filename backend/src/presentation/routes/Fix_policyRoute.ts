import { Router} from 'express';
import { PolicyController } from '../controllers/Fix_policyController.js';

export function PolicyRouter() {
    const policyRouter = Router();
    const policyController = new PolicyController();

    policyRouter.patch('/id/:idPolitica', (req, res, next) => { 
        policyController.updatePoliticy(req, res, next); 
    });

    policyRouter.get('/id/:idPolitica', (req, res, next) => { 
        policyController.getById(req, res, next); 
    });

    return policyRouter;
}
