import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./AuthMiddleware.js";
import { JWTService } from "../../application/services/JWTService.js";
import { JwtPayloadInterface } from "../../domain/interfaces/Fix_jwtPayloadInterface.js";
import { UnauthorizedError } from "../../shared/exceptions/UnauthorizedError.js";


export const OptionalAuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userJWT = req.headers.authorization?.split(' ')[1];
    const qrToken = req.headers.cookie
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
