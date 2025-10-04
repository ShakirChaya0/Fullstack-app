
interface OrderLineClientInfo {
    nombreProducto: string,
    cantidad: number,
    estado: string,
}


export interface OrderClientInfo {
    idPedido: number
    lineasPedido: OrderLineClientInfo[],
    estado: string,
    observaciones: string
}