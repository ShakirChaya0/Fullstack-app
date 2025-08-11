interface OrderLinesKitchenInfo {
    nombreProducto: string,
    tipoComida: string | null,
    cantidad: number,
    estado: string   
}

export interface OrderKitchenInfo {
    idPedido: number,
    horaInicio: string,
    lineasPedido: OrderLinesKitchenInfo[]
    estado: string,
    observaciones: string
}