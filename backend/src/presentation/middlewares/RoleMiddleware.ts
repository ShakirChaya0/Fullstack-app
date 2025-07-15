import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './AuthMiddleware.js';
import { ForbiddenError } from '../../shared/exceptions/ForbiddenError.js';
import { TipoUsuario_Type } from '@prisma/client';
import { UnauthorizedError } from '../../shared/exceptions/UnauthorizedError.js';

export function RoleMiddleware(allowedRoles: TipoUsuario_Type[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new UnauthorizedError('Usuario no autenticado');
        }
        const userRole = req.user.tipoUsuario as TipoUsuario_Type;
        
        if (!allowedRoles.includes(userRole)) {
            throw new ForbiddenError('No tienes permisos para acceder a este recurso');
        }
        next();
    };
}