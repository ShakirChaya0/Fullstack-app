import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../shared/exceptions/UnauthorizedError.js";
import { JwtPayloadInterface } from "../../domain/interfaces/JwtPayloadInterface.js";
import { JWTService } from "../../application/services/JWTService.js";

export interface AuthenticatedRequest extends Request {
    user?: JwtPayloadInterface;
    qrToken?: string
}

export async function AuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    const jwtService = new JWTService();

    if (!token) throw new UnauthorizedError("Token no proporcionado");

    try {
        const payload =  jwtService.verifyAccessToken(token);
        req.user = payload as JwtPayloadInterface;
        next();
    } catch {
        const error = new UnauthorizedError("Token expirado");
        next(error)
    }
}