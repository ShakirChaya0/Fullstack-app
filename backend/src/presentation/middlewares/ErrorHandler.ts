import { NextFunction, Request, Response, ErrorRequestHandler } from 'express';

type PossibleError = Error & {
    statusCode?: number
}

export const ErrorHandler: ErrorRequestHandler = (error: PossibleError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.statusCode || 500;
    
    res.status(statusCode).json({ 
        name: error.name || "Error", 
        message: error.message || "Internal Server Error" 
    });
}