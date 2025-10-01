import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./AuthMiddleware.js";
import { JWTService } from "../../application/services/JWTService.js";
import { JwtPayloadInterface } from "../../domain/interfaces/JwtPayloadInterface.js";

export const OptionalAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userJWT = req.headers.authorization?.split(' ')[1];
    const qrToken = req.cookies.QrToken
    req.qrToken = qrToken

    const jwtService = new JWTService();

    if(!userJWT){
        req.user = undefined
        next()
        return  
    } 

    try {
        const payload =  jwtService.verifyAccessToken(userJWT);
        req.user = payload as JwtPayloadInterface;
        next();
    } catch (error) {
        next(error)
    }
};
