import { Table } from "./Table.js";
import {UUID} from "crypto";

export type EstadoReserva = "Realizada" | "Asistida" | "No_Asistida" | "Cancelada";

export class Reservation {
    constructor(
        private readonly _reserveId: number,
        private _reserveDate: Date,
        private _reserveTime: string,
        private _cancelationDate: Date | null,
        private _commensalsNumber: number,
        private _status: EstadoReserva, 
        private _clientId: UUID, 
        private _table: Table[],    
    ) {}   

    public get reserveId(): number {
        return this._reserveId;
    }
    public get clientId(): UUID | null {
        return this._clientId;
    }
    public get cancelationDate(): Date | null {
        return this._cancelationDate;
    }
    public get reserveTime(): string {
        return this._reserveTime;
    }
    public get reserveDate(): Date {
        return this._reserveDate;
    }
    public get commensalsNumber(): number {
        return this._commensalsNumber;
    }
    public get status(): EstadoReserva {
        return this._status;
    }
    public get table(): Table[] {
        return this._table;
    }

    public set clientId(clientId: UUID) {
        this._clientId = clientId;
    }
    public set cancelationDate(date: Date) {
        this._cancelationDate = date;
    }
    public set reserveTime(time: string) {
        this._reserveTime = time;
    }
    public set reserveDate(date: Date) {
        this._reserveDate = date;
    }
    public set commensalsNumber(number: number) {
        this._commensalsNumber = number;
    }
    public set status(status: EstadoReserva) {
        this._status = status;
    }
    public set table(table: Table) {
        this._table.push(table);   
    }
}