// Clase de error usada para manejar errores de recursos no encontrados (ya la conocemos todos)
export class NotFoundError extends Error {
    public readonly statusCode = 404;

    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}