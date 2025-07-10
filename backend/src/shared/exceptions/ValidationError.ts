/*
    The HTTP 400 Bad Request response status code indicates that the server 
    cannot or will not process the request due to something that is perceived 
    to be a client error (for example, malformed request syntax, invalid request
    message framing, or deceptive request routing).
*/

// Clase de error para manejar errores de validación de entrada de datos primitivos (ejemplo: validaciones fallidas de Zod)
export class ValidationError extends Error {
    public readonly statusCode = 400;

    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
