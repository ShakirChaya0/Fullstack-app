import { Router } from "express";
import { PricesController } from "../controllers/PricesController.js";

export function PricesRouter () {
    const pricesRouter = Router();
    const pricesController = new PricesController();
    
    pricesRouter.get("/", (req, res, next) => { pricesController.getAll(req, res, next) });

    pricesRouter.get("/search", (req, res, next) => { pricesController.getOne(req, res, next) });

    pricesRouter.get("/producto/:id", (req, res, next) => { pricesController.getByProd(req, res, next) });

    pricesRouter.get("/actual/:id", (req, res, next) => { pricesController.getActual(req, res, next) });

    pricesRouter.post("/", (req, res, next) => { pricesController.create(req, res, next) });

    pricesRouter.delete("/", (req, res, next) => { pricesController.delete(req, res, next) });

    return pricesRouter;
}