import { Router } from "express";
import { AdminController } from "../controllers/AdminController.js";

export function adminRouter() {
    const adminRouter = Router();
    const adminController = new AdminController();

    adminRouter.get('/', (req, res, next) => { adminController.getAdmin(req, res, next) });

    adminRouter.patch('/update/:idAdmin', (req, res, next) => { adminController.updateAdminProfile(req, res, next) });

    return adminRouter
}
