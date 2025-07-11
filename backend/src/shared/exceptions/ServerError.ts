/* 
    The HTTP 500 Internal Server Error server error response code indicates 
    that the server encountered an unexpected condition that prevented it from fulfilling the request.
*/

// Clase de error que a priori no debería ser lanzada, pero se utiliza para el default del ErrorHandler (puede cambiar a futuro)
export class ServerError extends Error {
    public readonly statusCode = 500;

    constructor(message: string) {
        super(message);
        this.name = "ServerError";
        Object.setPrototypeOf(this, ServerError.prototype);
    }
}
