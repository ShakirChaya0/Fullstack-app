/*
    The HTTP 422 Unprocessable Content response status code indicates
    that the server understands the content type of the request entity, 
    and the syntax of the request entity is correct, but it was unable 
    to process the contained instructions.
*/

// Clase de error utilizada cuando hay un error en lógica de negocio
export class BusinessError extends Error {
    public readonly statusCode = 422;

    constructor(message: string) {
        super(message);
        this.name = "BusinessError";
        Object.setPrototypeOf(this, BusinessError.prototype);
    }
}