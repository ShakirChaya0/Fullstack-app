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

export class Check {
    constructor(
        readonly nombreRestaurante: string,
        readonly direccionRestaurante: string,
        readonly razonSocial: string,
        readonly telefonoContacto: string,
        readonly nroMesa: number,
        readonly fecha: Date,
        readonly nombreMozo: string,
        readonly totalCubiertos: number,
        readonly pedido: PedidoCheck
    ){}
}