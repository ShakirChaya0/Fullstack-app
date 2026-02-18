import { PedidoCheck } from "../../shared/types/SharedTypes.js";

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