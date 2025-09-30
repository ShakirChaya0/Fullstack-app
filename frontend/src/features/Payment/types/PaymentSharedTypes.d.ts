export type CheckLine = {
    nombreProducto: string,
    cantidad: number,
    montoUnitario: number,
    importe: number
}

export type PedidoCheck = {
    idPedido: number,
    lines: CheckLine[]
    subtotal: number,
    importeImpuestos: number,
    total: number
}

export type CheckType = {
    nombreRestaurante: string,
    direccionRestaurante: string,
    razonSocial: string,
    telefonoContacto: string,
    nroMesa: number,
    fecha: Date,
    nombreMozo: string,
    totalCubiertos: number,
    pedido: PedidoCheck
}