import { Request, Response  } from "express";
import { CUU17RegisterTable } from "../../application/use_cases/TableUseCase/CUU17RegisterTable.js";
import { validateTable } from "../validators/tableZod.js";

export class TableController {
    constructor(
        private readonly CU17RegisterTable = new CUU17RegisterTable
    ){}
    public create = async (req:Request, res: Response) => {
        try {
            const result = validateTable(req.body);
            if(result.success){
                const tables = await this.CU17RegisterTable.execute(req.body);
                res.status(200).json(tables);
            } 
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }
}