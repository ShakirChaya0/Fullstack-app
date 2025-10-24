
interface OrderLineClientInfo {
    nombreProducto: string,
    cantidad: number,
    estado: string,
    nroLinea?: number
}


export interface OrderClientInfo {
    idPedido: number
    lineasPedido: OrderLineClientInfo[],
    estado: string,
    observaciones: string
}