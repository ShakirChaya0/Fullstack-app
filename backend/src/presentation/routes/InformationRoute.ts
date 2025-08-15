import { Router } from 'express';
import { InformationController } from '../controllers/InformationController.js';
import { RoleMiddleware } from '../middlewares/RoleMiddleware.js';
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js';

export function InformationRouter() {
    const informationRouter = Router();
    const informationController = new InformationController();

    informationRouter.patch('/id/:idInformacion', AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { 
        informationController.updateInformation(req, res, next); 
    });

    informationRouter.get('/id/:idInformacion', (req, res, next) => { 
        informationController.getById(req, res, next); 
    });

    return informationRouter;
}