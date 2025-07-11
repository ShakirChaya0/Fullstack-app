import { Request, Response  } from "express";
import { CUU17RegisterTable } from "../../application/use_cases/TableUseCase/CUU17RegisterTable.js";
import {validatePartialTable, validateTable } from "../validators/tableZod.js";
import { GetAllTable} from "../../application/use_cases/TableUseCase/getTablesUseCase.js";
import { GetTableByCapacity } from "../../application/use_cases/TableUseCase/getTablesByCapacity.js";
import { DeleteTable } from "../../application/use_cases/TableUseCase/deleteTable.js";
import { UpdateTable } from "../../application/use_cases/TableUseCase/updateTable.js";

export class TableController {
    constructor(
        private readonly CU17RegisterTable = new CUU17RegisterTable,
        private readonly getAllTable = new GetAllTable,
        private readonly getTableByCapacity = new GetTableByCapacity,
        private readonly deletedTable = new DeleteTable, 
        private readonly updateTable = new UpdateTable 
    ){}

    public getAll = async (req:Request, res:Response) => {
        try {
            const tables = await this.getAllTable.execute();
            res.status(200).json(tables);
        }   catch (error: any){
            res.status(500).json({ error: error.message || "Error al obtener las mesas" });
        }
    }

    public getByCapacity = async (req:Request, res:Response) =>{
        try {
            const capacity = req.params.capacity
            if(!capacity || isNaN(+capacity)){
                throw new Error ("La capacidad de la mesa debe ser un numero entero.");
            }
            const tables = await this.getTableByCapacity.execute(+capacity);
            if(tables !== null) {
                res.status(200).json(tables);
            } 
        } catch (error: any){
            res.status(400).json({error: "No hay mesas para esa capacidad"})
        }
    }

    public create = async (req:Request, res: Response) => {
        try {
            const result = validateTable(req.body);
            const tables = await this.CU17RegisterTable.execute(result);
                res.status(201).json(tables);
            } 
        catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }

    public update = async (req:Request, res: Response) => {
        try {
            const numTable = req.params.numTable;
            if(!numTable || isNaN(+numTable)){
                res.status(400).json({ error: "El numero de la mesa es inválido" });
            }

            const data = req.body; 
            const result = validatePartialTable(data);
            const updateTable = await this.updateTable.execute(+numTable,result); 
            res.status(200).json(updateTable);

        } catch (error: any) {
            res.status(500).json({ error: error.message || "Error al modificar la mesa" });
        }

    }

    public delete = async (req: Request, res: Response) => {
        try {
            const nroMesa = req.params.numTable; 
            if(!nroMesa || isNaN(+nroMesa)){
                res.status(400).json("El numero de la mesa debe ser un entero.");
            }
            const deletedTable = await this.deletedTable.execute(+nroMesa);
            res.status(200).json(deletedTable);
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }
}