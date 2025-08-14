interface OrderLineWaiteInfo {
    nombreProducto: string,
    cantidad: number,
    estado: string
}

export interface OrderWaiterInfo {
    idPedido: number,
    horaInicio: string,
    nroMesa: number,
    cantidadCubiertos: number,
    lineasPedido: OrderLineWaiteInfo[],
    estado: string,
    observaciones: string,
}