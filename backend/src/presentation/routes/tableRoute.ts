import {Router} from 'express'; 
import { TableController } from '../controllers/tableController.js';

export function mesaRouter (){
    const tableRouter = Router(); 
    const tableController = new TableController; 

    tableRouter.post('/', (req,res) => {tableController.create(req,res)}); 
    
    return tableRouter;
}