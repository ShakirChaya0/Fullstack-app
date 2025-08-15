import {Router} from 'express'; 
import { ClientController } from '../controllers/ClientController.js'; 
import { AuthMiddleware } from '../middlewares/AuthMiddleware.js';
import { RoleMiddleware } from '../middlewares/RoleMiddleware.js';

export function ClientRouter () {
    const clientRouter = Router(); 
    const clientController = new ClientController;

    clientRouter.get('/', AuthMiddleware, RoleMiddleware(["Administrador"]), (req,res,next) => { clientController.getAll(req,res,next) }); 

    clientRouter.get('/id/:idUsuario', AuthMiddleware, RoleMiddleware(["Administrador"]), (req,res,next) => { clientController.getClientById(req,res,next) });

    clientRouter.get('/nombreUsuario/:nombreUsuario', AuthMiddleware, RoleMiddleware(["Administrador", "Cliente"]), (req,res,next) => { clientController.getClientByUsername(req,res,next) }); 

    clientRouter.post('/', (req,res,next) => { clientController.createClient(req,res,next) });

    clientRouter.patch('/id/:idUsuario', AuthMiddleware, RoleMiddleware(["Cliente"]), (req,res,next) => { clientController.updateClient(req,res,next) });
    
    return clientRouter;

}