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

    // 🔍 Debug: ver qué llega
    console.log('🔐 Auth Middleware - JWT:', jwt ? '  Presente' : '❌ Ausente');
    console.log('🎫 Auth Middleware - qrToken inicial:', qrToken);
    
    // Si no está en auth, intentar leerlo desde las cookies
    if (!qrToken) {
        const cookies = socket.handshake.headers.cookie;
        console.log('🍪 Cookies recibidas:', cookies);
        if (cookies) {
            const cookieArray = cookies.split(';');
            const qrCookie = cookieArray.find(cookie => cookie.trim().startsWith('QrToken='));
            if (qrCookie) {
                qrToken = qrCookie.split('=')[1];
                console.log('  qrToken extraído de cookie:', qrToken);
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
    console.log('  Socket autenticado - qrToken final:', qrToken);
    next();
}

/*
    // Leer qrToken desde las cookies HTTP
    let qrToken = socket.handshake.auth.qrToken;
    
    // Si no está en auth, intentar leerlo desde las cookies
    if (!qrToken) {
        const cookies = socket.handshake.headers.cookie;
        if (cookies) {
            const cookieArray = cookies.split(';');
            const qrCookie = cookieArray.find(cookie => cookie.trim().startsWith('qrToken='));
            if (qrCookie) {
                qrToken = qrCookie.split('=')[1];
            }
        }
    }
*/