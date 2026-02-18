/*
    The HTTP 403 Forbidden response status code indicates that the 
    server understands the request but refuses to authorize it.

    This status is similar to 401, but for the 403 Forbidden status code, 
    re-authenticating makes no difference. The access is tied to the application 
    logic, such as insufficient rights to a resource.
*/

// Clase de error utilizada para cuando un usario autenticado intenta acceder a un recurso o realizar una acción que no está permitida para su rol o permisos
export class ForbiddenError extends Error {
    public readonly statusCode = 403;

    constructor(message: string) {
        super(message);
        this.name = "ForbiddenError";
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}
