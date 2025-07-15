import {Router} from 'express'; 
import { ClientController } from '../controllers/ClientController.js'; 

export function ClientRouter () {
    const clientRouter = Router(); 
    const clientController = new ClientController;

    clientRouter.get('/', (req,res,next) =>  {clientController.getAll(req,res,next)}); 

    clientRouter.get('/id/:idUsuario', (req,res,next) => {clientController.getClientById(req,res,next)});

    clientRouter.get('/nombreUsuario/:nombreUsuario', (req,res,next) => {clientController.getClientByUsername(req,res,next)}); 

    clientRouter.post('/', (req,res,next) => {clientController.createClient(req,res,next)});

    clientRouter.patch('/id/:idUsuario', (req,res,next) => {clientController.updateClient(req,res,next)});
    
    return clientRouter;

}