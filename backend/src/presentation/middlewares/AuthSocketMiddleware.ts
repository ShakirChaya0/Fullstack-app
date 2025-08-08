import dotenv from 'dotenv';
import { UnauthorizedError } from "../../shared/exceptions/UnauthorizedError.js";
import { JwtPayloadInterface } from "../../domain/interfaces/jwtPayloadInterface.js";
import { JWTService } from "../../application/services/JWTService.js";
import { Socket } from "socket.io";

dotenv.config();
const jwtService = new JWTService();

export interface AuthenticatedSocket extends Socket {
  user?: JwtPayloadInterface;
  qrToken?: string;
}


export async function AuthSocketMiddleware(socket: Socket, next: (err?: Error) => void) {
    const jwt = socket.handshake.headers.authorization?.split(' ')[1];
    const qrToken = socket.handshake.headers.cookie;

    try {
        if (jwt) {
            const payload =  jwtService.verifyAccessToken(jwt);
            (socket as AuthenticatedSocket).user = payload as JwtPayloadInterface;
            next();
        } 
    } catch (error) {
        throw new UnauthorizedError("Token inválido o expirado");
    }

    (socket as AuthenticatedSocket).qrToken = qrToken;
    next();
}