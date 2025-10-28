import type { OrderLineStatus } from "../../KitchenOrders/types/SharedTypes";
import type { FoodType } from "../../Product&Price/types/product&PriceTypes";
import type { Bebida, Comida } from "../../Products/interfaces/products"

export type OrderStatus = "Solicitado" | "En_Preparacion" | "Completado" | "Pendiente_De_Pago" | "Pendiente_De_Cobro" | "Pagado"

export type LineaPedido = {
    producto: Comida | Bebida,
    cantidad: number,
    estado: OrderLineStatus,
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

export type WaiterOrder = Pedido & {
    nroMesa: number,
    horaInicio: string,
    idMozo?: string,
    cantCubiertos: number,
}

export interface OrderLineClientInfo {
    nombreProducto: string,
    tipo: FoodType | null,
    cantidad: number,
    estado: string,
    nroLinea?: number
}

export interface OrderClientInfo {
    idPedido: number
    lineasPedido: OrderLineClientInfo[],
    estado: OrderStatus,
    comensales: number,
    observaciones: string
}

export interface OrderWithTableId extends Pedido {
    tableNumber: number
}