import { NextFunction, Request, Response } from "express";
import dotenv from 'dotenv';
import { UnauthorizedError } from "../../shared/exceptions/UnauthorizedError.js";
import { JwtPayloadInterface } from "../../domain/interfaces/jwtPayloadInterface.js";
import { JWTService } from "../../application/services/JWTService.js";

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: JwtPayloadInterface;
  qrToken?: string
}

export async function AuthMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    const jwtService = new JWTService();

    if(!token) throw new UnauthorizedError("Token no proporcionado");

    try {
        const payload =  jwtService.verifyAccessToken(token);
        req.user = payload as JwtPayloadInterface;
        next();
    } catch (error) {
        throw new UnauthorizedError("Token inválido o expirado");
    }
}