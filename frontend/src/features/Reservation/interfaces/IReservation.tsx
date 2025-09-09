import type { ITable } from "../../Tables/interfaces/ITable";

export type StateReservation = "Realizada" | "Asistida" | "No_Asistida" | "Cancelada";

export interface ClientPublicInfo {
    readonly nombre: string, 
    readonly apellido: string,
    readonly telefono: string
}

export interface IReservation {
    readonly _reserveId: number,
    _reservationDate : Date, 
    _reserveTime : string,
    _cancelationDate: Date | null,
    _commensalsNumber: number,
    _status: StateReservation, 
    _clientPublicInfo: ClientPublicInfo,
    _table: ITable[]
}