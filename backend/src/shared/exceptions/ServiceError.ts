/*
    The HTTP 503 Service Unavailable server error response code 
    indicates that the server is not ready to handle the request.
*/

// Clase de error utilizada cuando un servicio que utiliza nuestra API está caida temporalmente o no está disponible, por ejemplo al interactuar con la API de Mercado Pago.
export class ServiceError extends Error {
    public readonly statusCode = 503;

    constructor(message: string) {
        super(message);
        this.name = "ServiceError";
        Object.setPrototypeOf(this, ServiceError.prototype);
    }
}