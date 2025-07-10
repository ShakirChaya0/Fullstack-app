/*
    The HTTP 409 Conflict response status code indicates a request 
    conflict with the current state of the target resource.

    Conflicts are most likely to occur in response to a PUT request. 
    For example, you may get a 409 response when uploading a file that is older 
    than the existing one on the server, resulting in a version control conflict.
*/

// Clase de error utilizada cuando hay un conflicto en el estado del recurso solicitado, por ejemplo al intentar registrar un usuario nuevo con un email que ya está en uso.
export class ConflictError extends Error {
    public readonly statusCode = 409;

    constructor(message: string) {
        super(message);
        this.name = "ConflictError";
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}