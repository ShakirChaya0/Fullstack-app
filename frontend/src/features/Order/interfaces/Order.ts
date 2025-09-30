import type { Bebida, Comida } from "../../Products/interfaces/products"

export type OrderStatus = "Solicitado" | "En_Preparacion" | "Completado" | "Pendiente_De_Pago" | "Pendiente_De_Cobro" | "Pagado"

export type LineaPedido = {
    producto: Comida | Bebida,
    cantidad: number,
    estado: string,
    subtotal: number
}

export type Pedido = {
    lineasPedido: LineaPedido[],
    estado: OrderStatus,
    observaciones: string,
    comensales: number
}

export interface OrderWithTableId extends Pedido {
    tableNumber: number
}