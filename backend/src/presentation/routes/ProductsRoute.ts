import { Router } from "express";
import { ProductController } from "../controllers/ProductsController.js";

export function ProductosRouter () {
    const productRouter = Router();
    const productController = new ProductController();
    
    productRouter.get("/", (req, res, next) => { productController.getAll(req, res, next) });

    productRouter.get("/id/:idProducto", (req, res, next) => { productController.getById(req, res, next) });
    
    productRouter.get("/nombre/:nombreProducto", (req, res, next) => { productController.getByName(req, res, next) });

    productRouter.get("/tipoProducto/:tipoProducto", (req, res, next) => { productController.getByType(req, res, next) });

    productRouter.post("/", (req, res, next) => { productController.create(req, res, next) });

    productRouter.patch("/id/:idProducto", (req, res, next) => { productController.update(req, res, next) });

    return productRouter;
}