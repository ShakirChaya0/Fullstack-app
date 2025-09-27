import { Request, Response, NextFunction } from "express"
import { CUU18RegisterProduct } from "../../application/use_cases/ProductsUseCases/CUU18RegisterProduct.js";
import { CUU19ModifyProduct } from "../../application/use_cases/ProductsUseCases/CUU19ModifyProduct.js";
import { GetProductsUseCase } from "../../application/use_cases/ProductsUseCases/GetProductsUseCase.js";
import { GetProductByIdUseCase } from "../../application/use_cases/ProductsUseCases/GetProductByIdUseCase.js";
import { PartialSchemaProductos, ValidateProduct, ValidateProductPartial } from "../../shared/validators/ProductZod.js";
import { GetProductByNameUseCase } from "../../application/use_cases/ProductsUseCases/GetProductByNameUseCase.js";
import { GetProductByTypeUseCase } from "../../application/use_cases/ProductsUseCases/GetProductByTypeUseCase.js";
import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { NotFoundError } from "../../shared/exceptions/NotFoundError.js";

export class ProductController {
    constructor(
        private readonly CU18RegisterProduct = new CUU18RegisterProduct(),
        private readonly CU19ModifyProduct = new CUU19ModifyProduct(),
        private readonly getProductsUseCase = new GetProductsUseCase(),
        private readonly getProductByIdUseCase = new GetProductByIdUseCase(),
        private readonly getProductByNameUseCase = new GetProductByNameUseCase(),
        private readonly getProductByTypeUseCase = new GetProductByTypeUseCase()
    ) {}

    public getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const products = await this.getProductsUseCase.execute();
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    public getAllPaginated = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Extrayendo parametros para paginación
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10

            // Ejecutando el getAll paginado
            const productsPaginated = await this.getProductsUseCase.executePaginated(page, limit)
            
            res.status(200).json({
                data: productsPaginated.products,
                pagination: {
                    currentPage: productsPaginated.currentPage,
                    totalPages: productsPaginated.totalPages,
                    totalItems: productsPaginated.totalItems,
                    ItemsPerPage: limit,
                    hasNextPage: productsPaginated.hasNextPage,
                    hasPreviousPage: productsPaginated.hasPreviousPage
                }
            });
        } catch (error) {
            next(error);
        }
    }

    public getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idProducto = req.params.idProducto;
            if (!idProducto || isNaN(+idProducto)) {
                throw new ValidationError("El ID ingresado debe ser un número");
            }

            const product = await this.getProductByIdUseCase.execute(+idProducto);
            if (!product) {
                throw new NotFoundError("Producto no encontrado");
            }
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    public getByName = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const draft = req.params.nombreProducto;
            if (!draft) {
                throw new ValidationError("El nombre del producto es requerido");
            }

            const nombreProducto = draft.replace(/_/g, ' ');
            const product = await this.getProductByNameUseCase.execute(nombreProducto);
            if (!product) {
                throw new NotFoundError("Producto no encontrado");
            }
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    public getByNamePaginated = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const draft = req.params.nombreProducto;
            if (!draft) {
                throw new ValidationError("El nombre del producto es requerido");
            }
            const page = parseInt(req.query.page as string) || 1
            const limit = parseInt(req.query.limit as string) || 10

            const nombreProducto = draft.replace(/_/g, ' ');
            const productsPaginated = await this.getProductByNameUseCase.executePaginated(page, limit, nombreProducto);
            if (productsPaginated.products.length == 0) {
                throw new NotFoundError("Producto no encontrado");
            }
            
            
            res.status(200).json({
                data: productsPaginated.products,
                pagination: {
                    currentPage: productsPaginated.currentPage,
                    totalPages: productsPaginated.totalPages,
                    totalItems: productsPaginated.totalItems,
                    ItemsPerPage: limit,
                    hasNextPage: productsPaginated.hasNextPage,
                    hasPreviousPage: productsPaginated.hasPreviousPage
                }
            });

        } catch (error) {
            next(error);
        }
    }

    public getByType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const tipoProducto = req.params.tipoProducto;
            if (!tipoProducto) {
                throw new ValidationError("El nombre del producto es requerido");
            }

            const products = await this.getProductByTypeUseCase.execute(tipoProducto);
            if (!products) {
                throw new NotFoundError("Producto no encontrado");
            }
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    public create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validatedProduct = ValidateProduct(req.body);
            if(!validatedProduct.success) throw new ValidationError(`Validation failed: ${validatedProduct.error.message}`);
            const registeredProducts = {
              ...validatedProduct.data
            };

            const product = await this.CU18RegisterProduct.execute(registeredProducts);
            res.status(201).json(product);
        }
        catch(error) {
            next(error);
        }
    }

    public update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const idProducto = req.params.idProducto;
            if (!idProducto || isNaN(+idProducto)) {
                throw new ValidationError("El ID ingresado debe ser un número");
            }

            const validatedProduct = ValidateProductPartial(req.body);
            if(!validatedProduct.success) throw new ValidationError(`Validation failed: ${validatedProduct.error.message}`);
            const partialProduct: PartialSchemaProductos = validatedProduct.data;

            const product = await this.CU19ModifyProduct.execute(+idProducto, partialProduct);
            if (!product) {
                throw new NotFoundError("Producto no encontrado");
            }
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }
}