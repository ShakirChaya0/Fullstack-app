import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';

type PossibleError = Error & {
    statusCode?: number
}

export const ErrorHandler: ErrorRequestHandler = (error: PossibleError, req: Request, res: Response, next: NextFunction) => {
    if (error.statusCode) {
        res.status(error.statusCode).json({ name: error.name, message: error.message });
    }
    
    // Si el error no es ninguno de los anteriores, se considera un error interno del servidor
    // CAMBIAR A SERVER ERROR
    else res.status(500).json(error);
}