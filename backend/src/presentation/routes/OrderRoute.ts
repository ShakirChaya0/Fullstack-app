import { Router } from "express";
import { OrderController } from "../controllers/OrderController.js";


export function OrderRouter(){
    const orderRouter = Router()

    const orderController = new OrderController()

    orderRouter.post("/", (req, res, next) => { orderController.create(req, res, next) })
    
    return orderRouter
}