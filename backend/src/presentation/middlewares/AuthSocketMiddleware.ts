import { JwtPayloadInterface } from "../../domain/interfaces/JwtPayloadInterface.js";
import { JWTService } from "../../application/services/JWTService.js";
import { Socket } from "socket.io";
import { HandleSocketError } from '../sockets/handlers/HandleSocketError.js';

const jwtService = new JWTService();

export interface AuthenticatedSocket extends Socket {
    user?: JwtPayloadInterface;
    qrToken?: string;
}

export async function AuthSocketMiddleware(socket: Socket, next: (err?: Error) => void) {
    const jwt = socket.handshake.auth.jwt;
    let qrToken = socket.handshake.auth.qrToken;
    
    // Si no está en auth, intentar leerlo desde las cookies
    if (!qrToken) {
        const cookies = socket.handshake.headers.cookie;
        if (cookies) {
            const cookieArray = cookies.split(';');
            const qrCookie = cookieArray.find(cookie => cookie.trim().startsWith('QrToken='));
            if (qrCookie) {
                qrToken = qrCookie.split('=')[1];
            }
        }
    }

    try {
        if (jwt) {
            const payload =  jwtService.verifyAccessToken(jwt);
            (socket as AuthenticatedSocket).user = payload as JwtPayloadInterface;
            (socket as AuthenticatedSocket).qrToken = qrToken;
        } 
    } catch (error: any) {
        HandleSocketError(socket, error)
    }

    (socket as AuthenticatedSocket).qrToken = qrToken;
    next();
}
