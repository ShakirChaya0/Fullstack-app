import { Request, Response } from "express"
import { CUU18RegisterProducts } from "../../application/use_cases/CUU18-registerProduct.js";

export class productController {
    static create = async (req: Request, res: Response) => {
        try{
            const data = req.body;
            const product = await CUU18RegisterProducts.execute(data);
            res.status(201).json(product);
            return;
        }
        catch(error: any){
            res.status(500).json({ error: error.message });
            return;
        }
    }
    static getById = async (req: Request, res: Response) => {

    }
}