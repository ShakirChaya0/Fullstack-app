import { Router } from "express";
import { ProductController } from "../controllers/productsController.js";

export function productosRouter () {
    const productRouter = Router();
    const productController = new ProductController();
    
    productRouter.get("/", (req, res) => { productController.getAll(req, res) });

    productRouter.get("/id/:idProducto", (req, res) => { productController.getById(req, res) });
    
    productRouter.get("/nombre/:nombreProducto", (req, res) => { productController.getByName(req, res) });

    productRouter.get("/tipoProducto/:tipoProducto", (req, res) => { productController.getByType(req, res) });

    productRouter.post("/", (req, res) => { productController.create(req, res) });

    productRouter.patch("/id/:idProducto", (req, res) => { productController.update(req, res) });

    return productRouter;
}