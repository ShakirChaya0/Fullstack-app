import { Router } from "express";
import { ProductController } from "../controllers/ProductsController.js";
import { RoleMiddleware } from "../middlewares/RoleMiddleware.js";
import { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

export function ProductosRouter () {
    const productRouter = Router();
    const productController = new ProductController();
    
    productRouter.get("/", (req, res, next) => { 
        // Si hay query parameters, usar paginación
        if (req.query.page || req.query.limit) {
            productController.getAllPaginated(req, res, next)
        } else {
            productController.getAll(req, res, next)
        }
     });

    productRouter.get("/id/:idProducto", (req, res, next) => { productController.getById(req, res, next) });
    
    productRouter.get("/nombre/:nombreProducto", (req, res, next) => { productController.getByName(req, res, next) });

    productRouter.get("/tipoProducto/:tipoProducto", (req, res, next) => { productController.getByType(req, res, next) });

    productRouter.post("/", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { productController.create(req, res, next) });

    productRouter.patch("/id/:idProducto", AuthMiddleware, RoleMiddleware(["Administrador"]), (req, res, next) => { productController.update(req, res, next) });

    return productRouter;
}