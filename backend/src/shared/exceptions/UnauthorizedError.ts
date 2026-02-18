/*
    The HTTP 401 Unauthorized response status code indicates that the client 
    request has not been completed because it lacks valid authentication credentials 
    for the requested resource.

    This status code is similar to the 403 Forbidden status code, except that in situations 
    resulting in this status code, user authentication can allow access to the resource.
*/

// Clase de error utilizada para cuando un usuario no autenticado intenta acceder a un recurso que requiere autenticación
export class UnauthorizedError extends Error {
    public readonly statusCode = 401;

    constructor(message: string) {
        super(message);
        this.name = "UnauthorizedError";
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}