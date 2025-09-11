import { Router } from "express";
import { AuthController } from "../controllers/AuthController.js";

export function AuthRouter() {
    const authRouter = Router();
    const authController = new AuthController(); 

    authRouter.post('/login', (req, res, next) => { authController.login(req, res, next) });

    authRouter.post('/refresh', (req, res, next) => { authController.refresh(req, res, next) });

    authRouter.post('/logout', (req, res, next) => { authController.logout(req, res, next) });

    authRouter.post('/forgotPassword', (req, res, next) => { authController.forgotPassword(req, res, next) });

    authRouter.post('/resetPassword', (req, res, next) => { authController.resetPassword(req, res, next) });

    return authRouter
}