import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./AuthMiddleware.js";
import { JWTService } from "../../application/services/JWTService.js";
import { JwtPayloadInterface } from "../../domain/interfaces/jwtPayloadInterface.js";


export async function OptionalAuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        req.user = undefined;
        return next();
    }

    const jwtService = new JWTService();

    try {
        const payload = await jwtService.verifyAccessToken(token);
        req.user = payload as JwtPayloadInterface;
        next();
    } catch (error) {
        req.user = undefined;
        next();
    }
}