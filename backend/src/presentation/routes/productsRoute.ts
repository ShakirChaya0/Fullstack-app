import { Router } from "express";
import { productController } from "../controllers/productsController.js";

export function productosRouter () {
    const productRouter = Router()

    productRouter.post("/", (req, res) => {productController.create(req, res)})

    productRouter.get('/id/:idProducto', (req, res) => {productController.getById})

    return productRouter
}