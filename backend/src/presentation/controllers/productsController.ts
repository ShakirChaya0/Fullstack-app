import { Request, Response } from "express"
import { CUU18RegisterProducts } from "../../application/use_cases/CUU18-registerProduct.js";
import { GetProductsUseCase } from "../../application/use_cases/getProductsUseCase.js";
import { GetProductByIdUseCase } from "../../application/use_cases/getProductByIdUseCase.js";
import { CUU19ModifyProduct } from "../../application/use_cases/ProductsUseCases/CUU19-modifyProduct.js";
import { PartialSchemaProductos, ValidateProduct, ValidateProductPartial } from "../validators/productZod.js";
import { GetProductByNameUseCase } from "../../application/use_cases/getProductByNameUseCase.js";
import { getProductByTypeUseCase } from "../../application/use_cases/getProductByTypeUseCase.js";

export class productController {
    static getAll = async (req: Request, res: Response) => {
        try {
            const products = await GetProductsUseCase.execute();
            res.status(200).json(products);
        } catch (error: any) {
            res.status(500).json({ error: error.message })
        }
    }

    static getById = async (req: Request, res: Response) => {
        try {
            const idProducto = req.params.idProducto;
            if (!idProducto || isNaN(+idProducto)) {
                throw new Error("ID sent must be a number");
            }

            const product = await GetProductByIdUseCase.execute(+idProducto);
            if (!product) {
                res.status(404).json({ error: "Product not found" });
                return;
            }
            res.status(200).json(product);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static getByName = async (req: Request, res: Response) => {
        try {
            const draft = req.params.nombreProducto;
            if (!draft) {
                throw new Error("Product name is required");
            }

            const nombreProducto = draft.replace(/_/g, ' ');
            const product = await GetProductByNameUseCase.execute(nombreProducto);
            if (!product) {
                res.status(404).json({ error: "Product not found" });
                return;
            }
            res.status(200).json(product);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static getByType = async (req: Request, res: Response) => {
        try {
            const tipoProducto = req.params.tipoProducto;
            if (!tipoProducto) {
                throw new Error("Product type is required");
            }

            const products = await getProductByTypeUseCase.execute(tipoProducto);
            if (products == null) {
                res.status(404).json({ error: "No products found for this type" });
                return;
            }
            res.status(200).json(products);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    static create = async (req: Request, res: Response) => {
        try {
            const validatedProduct = ValidateProduct(req.body);
            if(!validatedProduct.success) throw new Error(`Validation failed: ${validatedProduct.error.message}`);
            const registeredProducts = {
              ...validatedProduct.data
            };

            const product = await CUU18RegisterProducts.execute(registeredProducts);
            res.status(201).json(product);
            return;
        }
        catch(error: any) {
            res.status(500).json({ error: error.message });
            return;
        }
    }

    static update = async (req: Request, res: Response) => {
        try {
            const idProducto = req.params.idProducto;
            if (!idProducto || isNaN(+idProducto)) {
                throw new Error("ID sent must be a number");
            }

            const validatedProduct = ValidateProductPartial(req.body);
            if(!validatedProduct.success) throw new Error(`Validation failed: ${validatedProduct.error.message}`);
            const partialProduct: PartialSchemaProductos = validatedProduct.data;

            const product = await CUU19ModifyProduct.execute(+idProducto, partialProduct);
            if (!product) {
                res.status(404).json({ error: "Product not found" });
                return;
            }
            res.status(200).json(product);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}