import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';
import { BusinessError } from '../../shared/exceptions/BusinessError.js';
import { ConflictError } from '../../shared/exceptions/ConflictError.js';
import { ForbiddenError } from '../../shared/exceptions/ForbiddenError.js';
import { NotFoundError } from '../../shared/exceptions/NotFoundError.js';
import { ServiceError } from '../../shared/exceptions/ServiceError.js';
import { UnauthorizedError } from '../../shared/exceptions/UnauthorizedError.js';
import { ValidationError } from '../../shared/exceptions/ValidationError.js';

export const ErrorHandler: ErrorRequestHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof BusinessError) {
        res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    else if (error instanceof ValidationError) {
        res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    else if (error instanceof UnauthorizedError) {
        res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    else if (error instanceof ForbiddenError) {
        res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    else if (error instanceof NotFoundError) {
        res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    else if (error instanceof ConflictError) {
        res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    else if (error instanceof ServiceError) {
        res.status(error.statusCode).json({ name: error.name, message: error.message });
    }

    // Si el error no es ninguno de los anteriores, se considera un error interno del servidor
    else res.status(500).json(error);
}