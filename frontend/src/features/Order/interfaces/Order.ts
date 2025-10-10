import type { Bebida, Comida } from "../../Products/interfaces/products"

export type OrderStatus = "Solicitado" | "En_Preparacion" | "Completado" | "Pendiente_De_Pago" | "Pendiente_De_Cobro" | "Pagado"

export type LineaPedido = {
    producto: Comida | Bebida,
    cantidad: number,
    estado: string,
    subtotal: number;
    lineNumber?: number;
    tipo?: string;
    esAlcoholica?: boolean
}

export type OrderWithOutId = {
    lineasPedido: LineaPedido[],
    observaciones: string,
    comensales: number,
    tableNumber: number
}

export type Pedido = {
    idPedido: number,
    lineasPedido: LineaPedido[],
    estado: OrderStatus,
    observaciones: string,
    comensales: number
}

export interface OrderWithTableId extends Pedido {
    tableNumber: number
}