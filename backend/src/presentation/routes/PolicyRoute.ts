import { Router } from 'express';
import { PolicyController } from '../controllers/PolicyController.js';

export function PolicyRouter() {
    const policyRouter = Router();
    const policyController = new PolicyController();

    policyRouter.patch('/id/:idPolitica', (req, res, next) => { 
        policyController.updatePoliticy(req, res, next); 
    });

    policyRouter.get('/', (req, res, next) => { 
        policyController.getPolicy(req, res, next); 
    });

    return policyRouter;
}
