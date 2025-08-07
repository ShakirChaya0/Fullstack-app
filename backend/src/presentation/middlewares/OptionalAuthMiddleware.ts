import { Request, Response, NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest } from "./AuthMiddleware.js";
import { JWTService } from "../../application/services/JWTService.js";
import { JwtPayloadInterface } from "../../domain/interfaces/jwtPayloadInterface.js";
import { NotFoundError } from "../../shared/exceptions/NotFoundError.js";
import { UnauthorizedError } from "../../shared/exceptions/UnauthorizedError.js";


export const OptionalAuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userJWT = req.headers.authorization?.split(' ')[1];
    const qrToken = req.headers.cookie

    const jwtService = new JWTService();

    if(!userJWT){
        req.user = undefined
        next()
        return  
    } 

    if(!qrToken){ // Es Mozo
        req.qrToken = undefined
    } 

    try {
        const payload =  jwtService.verifyAccessToken(userJWT);
        req.user = payload as JwtPayloadInterface;
        next();
    } catch (error) {
        throw new UnauthorizedError("Token inválido o expirado");
    }
};
