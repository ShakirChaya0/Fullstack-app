interface OrderLineWaiteInfo {
    nombreProducto: string,
    cantidad: number,
    estado: string
}

export interface OrderWaiterInfo {
    idPedido: number,
    horaInicio: string,
    nroMesa: number | undefined,
    cantidadCubiertos: number,
    lineasPedido: OrderLineWaiteInfo[],
    estado: string,
    observaciones: string,
}