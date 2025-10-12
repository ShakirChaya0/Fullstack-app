import type { statusTable } from "../types/TableTypes"

export interface ITable {
    readonly _tableNum: number, 
    _capacity: number, 
    _state: statusTable,
    _orders: {
        idMozo?: string
    }[]
}
