import { NextFunction, Request, Response } from 'express';
import { ConflictError } from '../../shared/exceptions/ConflictError.js';
import { ForbiddenError } from '../../shared/exceptions/ForbiddenError.js';
import { NotFoundError } from '../../shared/exceptions/NotFoundError.js';
import { ServiceError } from '../../shared/exceptions/ServiceError.js';
import { UnauthorizedError } from '../../shared/exceptions/UnauthorizedError.js';
import { ValidationError } from '../../shared/exceptions/ValidationError.js';

export const ErrorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ValidationError) {
        return res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    if (error instanceof UnauthorizedError) {
        return res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    if (error instanceof ForbiddenError) {
        return res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    if (error instanceof NotFoundError) {
        return res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    if (error instanceof ConflictError) {
        return res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    if (error instanceof ServiceError) {
        return res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    // Si el error no es ninguno de los anteriores, se considera un error interno del servidor
    return res.status(500).json({ name: "ServerError", message: 'Internal Server Error' });
}