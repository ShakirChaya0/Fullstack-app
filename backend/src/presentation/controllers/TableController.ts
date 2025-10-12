import { Request, Response, NextFunction } from "express";
import { CUU17RegisterTable } from "../../application/use_cases/TableUseCase/CUU17RegisterTable.js";
import { validateTable } from "../../shared/validators/TableZod.js";
import { GetAllTable} from "../../application/use_cases/TableUseCase/GetTablesUseCase.js";
import { UpdateTableUseCase } from "../../application/use_cases/TableUseCase/UpdateTableUseCase.js";
import { GetTableByCapacity } from "../../application/use_cases/TableUseCase/GetTablesByCapacity.js";
import { DeleteTable } from "../../application/use_cases/TableUseCase/DeleteTable.js";
import { UpdateCapacityTableUseCase } from "../../application/use_cases/TableUseCase/UpdateCapacityTableUseCase.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { GetTablesWithOrders } from "../../application/use_cases/TableUseCase/GetTablesWithOrders.js";

export class TableController {
    constructor(
        private readonly CU17RegisterTable = new CUU17RegisterTable(),
        private readonly getAllTable = new GetAllTable(),
        private readonly getTablesWithOrders = new GetTablesWithOrders(),
        private readonly getTableByCapacity = new GetTableByCapacity(),
        private readonly deletedTable = new DeleteTable(), 
        private readonly updateTable = new UpdateTableUseCase(), 
        private readonly updateCapacityTable = new UpdateCapacityTableUseCase() 
    ){}

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tables = await this.getAllTable.execute();
            res.status(200).json(tables);
        } catch (error) {
            next(error);
        }
    }

    public getWithOrders = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tables = await this.getTablesWithOrders.execute();
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
            res.status(200).json(tables);
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

    public delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const nroMesa = req.params.numTable; 
            if ( !nroMesa || isNaN(+nroMesa) ) {
                throw new ValidationError("El numero de la mesa debe ser un entero");
            }
            await this.deletedTable.execute(+nroMesa);
            res.status(204).json({message: "Mesa eliminada exitosamente"});
        } catch (error) {
            next(error);
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { numTable } = req.params; 
            const { statusTable } = req.body

            if (!numTable) throw new ValidationError('El numero de mesa es obligatorio'); 
            
            const numTableint = Number(numTable)

            if (statusTable !== 'Libre' && statusTable !== 'Ocupada') throw new ValidationError('El estado de la mesa ingresado es incorrecto');

            const updatedeTable = await this.updateTable.execute(numTableint, statusTable); 
            res.status(204).json(updatedeTable);

        } catch (error) {
            next(error);
        }
    }

    public updateCapacity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { numTable } = req.params

            if ( !numTable || isNaN(+numTable)) throw new ValidationError("El numero de la mesa debe ser un entero");

            const result = validateTable(req.body)
            const updatedTable = await this.updateCapacityTable.execute(+numTable, result.capacity)
            res.status(200).json(updatedTable);
        } catch(error) {
            next(error)
        }
    }
}