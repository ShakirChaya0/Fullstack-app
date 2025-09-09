import { Router } from 'express';
import { InformationController } from '../controllers/InformationController.js';
import { RoleMiddleware } from '../middlewares/RoleMiddleware.js';
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js';

export function InformationRouter() {
    const informationRouter = Router();
    const informationController = new InformationController();

    informationRouter.patch('/:idInformacion', (req, res, next) => { // AuthMiddleware, RoleMiddleware(["Administrador"])
        informationController.updateInformation(req, res, next); 
    });

    informationRouter.get('/', (req, res, next) => { 
        informationController.getInformation(req, res, next); 
    });

    return informationRouter;
}