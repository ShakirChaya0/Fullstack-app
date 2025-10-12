import type { OrderLine } from "../../KitchenOrders/interfaces/KitchenOrder"
import type { OrderStatus } from "../../Order/interfaces/Order"
import type { statusTable } from "../types/TableTypes"

export interface ITable {
    readonly _tableNum: number, 
    _capacity: number, 
    _state: statusTable,
    _orders: {
        cantidadCubiertos: number,
        estado: OrderStatus,
        horaInicio: string,
        idMozo?: string,
        idPedido: number,
        lineasPedido: OrderLine[],
        nroMesa: number,
        observaciones: string
    }[]
}
