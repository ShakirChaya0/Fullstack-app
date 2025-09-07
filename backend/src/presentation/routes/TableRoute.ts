import { Router } from 'express'; 
import { TableController } from '../controllers/TableController.js';
import { RoleMiddleware } from '../middlewares/RoleMiddleware.js';

export function MesaRouter (){
    const tableRouter = Router(); 
    const tableController = new TableController; 

    tableRouter.get('/', /*RoleMiddleware(["Administrador", "Mozo"])*/ (req, res, next) => { tableController.getAll(req, res, next) }); 

    tableRouter.get('/capacidad/:capacity', RoleMiddleware(["Administrador", "Mozo"]), (req, res, next)=> { tableController.getByCapacity(req, res, next) }); 

    tableRouter.post('/', /*RoleMiddleware(["Administrador"]),*/ (req, res, next) => { tableController.create(req, res, next) }); 
    
    tableRouter.delete('/nromesa/:numTable', /*RoleMiddleware(["Administrador"]),*/ (req, res, next) => { tableController.delete(req, res, next) }); 

    tableRouter.patch('/liberarMesa', RoleMiddleware(['Mozo']), (req,res,next) => {tableController.update(req, res, next) });

    tableRouter.patch('/actualizarCapacidad/:numTable', /*RoleMiddleware(['Administrador']),*/ (req, res, next) => {tableController.updateCapacity(req, res, next) });

    return tableRouter;
}