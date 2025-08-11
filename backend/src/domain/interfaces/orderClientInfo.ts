interface OrderLineClientInfo {
    nombreProducto: string,
    cantidad: number,
    estado: string
}

export interface OrderClientInfo {
    lineasPedido: OrderLineClientInfo[],
    estado: string,
    observaciones: string
}