import { Request, Response, NextFunction } from "express";
import { CUU17RegisterTable } from "../../application/use_cases/TableUseCase/CUU17RegisterTable.js";
import { validatePartialTable, validateTable } from "../validators/tableZod.js";
import { GetAllTable} from "../../application/use_cases/TableUseCase/getTablesUseCase.js";
import { GetTableByCapacity } from "../../application/use_cases/TableUseCase/getTablesByCapacity.js";
import { DeleteTable } from "../../application/use_cases/TableUseCase/deleteTable.js";
import { UpdateTable } from "../../application/use_cases/TableUseCase/updateTable.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";

export class TableController {
    constructor(
        private readonly CU17RegisterTable = new CUU17RegisterTable,
        private readonly getAllTable = new GetAllTable,
        private readonly getTableByCapacity = new GetTableByCapacity,
        private readonly deletedTable = new DeleteTable, 
        private readonly updateTable = new UpdateTable 
    ){}

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tables = await this.getAllTable.execute();
            res.status(200).json(tables);
        } catch (error) {
            next(error);
        }
    }

    public getByCapacity = async (req: Request, res: Response, next: NextFunction) =>{
        try {
            const capacity = req.params.capacity
            if(!capacity || isNaN(+capacity)){
                throw new ValidationError("La capacidad de la mesa debe ser un numero entero");
            }
            const tables = await this.getTableByCapacity.execute(+capacity);
            if(tables !== null) {
                res.status(200).json(tables);
            } 
        } catch (error) {
            next(error);
        }
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = validateTable(req.body);
            const tables = await this.CU17RegisterTable.execute(result);
                res.status(201).json(tables);
            } 
        catch (error) {
            next(error);
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const numTable = req.params.numTable;
            if(!numTable || isNaN(+numTable)){
                throw new ValidationError("El número de Mesa debe ser válido");
            }

            const data = req.body; 
            const result = validatePartialTable(data);
            const updateTable = await this.updateTable.execute(+numTable,result); 
            res.status(200).json(updateTable);
        } catch (error) {
            next(error);
        }

    }

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nroMesa = req.params.numTable; 
            if(!nroMesa || isNaN(+nroMesa)){
                throw new ValidationError("El numero de la mesa debe ser un entero");
            }
            const deletedTable = await this.deletedTable.execute(+nroMesa);
            res.status(200).json(deletedTable);
        } catch (error) {
            next(error);
        }
    }
}