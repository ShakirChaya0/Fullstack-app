import type { FoodType, OrderLineStatus, OrderStatus } from "../types/SharedTypes"

export interface KitchenOrder {
    idPedido: number,
    horaInicio: string,
    lineasPedido: OrderLine[]
    estado: OrderStatus,
    observaciones: string
}

export interface OrderLine {
    nroLinea: number,
    nombreProducto: string,
    tipoComida: FoodType,
    cantidad: number,
    estado: OrderLineStatus
}