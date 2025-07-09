import { Router } from 'express';
import { InformationController } from '../controllers/InformationController.js';

export function InformationRouter() {
    const informationRouter = Router();
    const informationController = new InformationController();

    informationRouter.patch('/id/:idInformacion', (req, res) => { 
        informationController.updateInformation(req, res); 
    });

    informationRouter.get('/id/:idInformacion', (req, res) => { 
        informationController.getById(req, res); 
    });

    return informationRouter;
}