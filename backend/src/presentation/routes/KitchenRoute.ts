import { Router } from 'express';
import { KitchenController } from '../controllers/KitchenController.js';

export function KitchenRouter() {
    const kitchenRouter = Router();

    const kitchenController = new KitchenController()

    kitchenRouter.get('/', (req, res, next) => { kitchenController.getKitchen(req, res, next) });
    
    kitchenRouter.patch('/update', (req, res, next) => { kitchenController.updateKitchen(req, res, next) });

    return kitchenRouter;
}