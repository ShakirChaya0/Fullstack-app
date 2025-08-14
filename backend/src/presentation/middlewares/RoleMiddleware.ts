import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './AuthMiddleware.js';
import { ForbiddenError } from '../../shared/exceptions/ForbiddenError.js';
import { UnauthorizedError } from '../../shared/exceptions/UnauthorizedError.js';
import { UserType } from '../../shared/types/SharedTypes.js';

export function RoleMiddleware(allowedRoles: UserType[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        if (!req.user) throw new UnauthorizedError('Usuario no autenticado');
        
        const userRole = req.user.tipoUsuario as UserType;
        
        if (!allowedRoles.includes(userRole)) throw new ForbiddenError('No tienes permisos para acceder a este recurso');
        next();
    };
}