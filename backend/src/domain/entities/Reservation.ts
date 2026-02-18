import { Table } from "./Table.js";
import { ClientPublicInfo } from "../interfaces/ClientPublicInfo.js";
import { StateReservation } from "../../shared/types/SharedTypes.js";

export class Reservation {
    constructor(
        private readonly _reserveId: number,
        private _reserveDate: Date,
        private _reserveTime: string,
        private _cancelationDate: Date | null,
        private _commensalsNumber: number,
        private _status: StateReservation, 
        private _clientPublicInfo: ClientPublicInfo,
        private _table: Table[],    
    ) {}   

    public get reserveId(): number {
        return this._reserveId;
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
    public get status(): StateReservation {
        return this._status;
    }
    public get table(): Table[] {
        return this._table;
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
    public set status(status: StateReservation) {
        this._status = status;
    }
    public set table(table: Table) {
        this._table.push(table);   
    }

    public get toPublicInfo() : ClientPublicInfo {
        return {
            nombre: this._clientPublicInfo.nombre, 
            apellido: this._clientPublicInfo.apellido, 
            telefono:this._clientPublicInfo.telefono
        }   
    }
}