import {Router} from 'express'; 
import { TableController } from '../controllers/tableController.js';

export function mesaRouter (){
    const tableRouter = Router(); 
    const tableController = new TableController; 

    tableRouter.get('/', (req,res)=> {tableController.getAll(req,res)}); 

    tableRouter.get('/capacidad/:capacity', (req,res)=> {tableController.getByCapacity(req,res)}); 

    tableRouter.patch('/nromesa/:numTable', (req,res) => {tableController.update(req,res)});

    tableRouter.post('/', (req,res) => {tableController.create(req,res)}); 
    
    tableRouter.delete('/nromesa/:numTable', (req,res) => {tableController.delete(req,res)}); 

    return tableRouter;
}