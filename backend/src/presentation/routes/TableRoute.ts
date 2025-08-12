import { Router } from 'express'; 
import { TableController } from '../controllers/TableController.js';

export function MesaRouter (){
    const tableRouter = Router(); 
    const tableController = new TableController; 

    tableRouter.get('/', (req, res, next)=> { tableController.getAll(req, res, next) }); 

    tableRouter.get('/capacidad/:capacity', (req, res, next)=> { tableController.getByCapacity(req, res, next) }); 

    tableRouter.post('/', (req, res, next) => { tableController.create(req, res, next) }); 
    
    tableRouter.delete('/nromesa/:numTable', (req, res, next) => { tableController.delete(req, res, next) }); 

    return tableRouter;
}