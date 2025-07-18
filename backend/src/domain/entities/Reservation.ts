import { Client } from "./Client.js";
import { EstadoReserva, Mesa } from "@prisma/client";

export class Reservation {
    constructor(
        private readonly _reserveId: number,
        private _cancelationDate: Date,
        private _reserveDate: Date,
        private _reserveTime: string,
        private _commensalsNumber: number,
        private _status: EstadoReserva, 
        private _client: Client | null, 
        private _table: Mesa[],    
    ) {}   

    public get reserveId(): number {
        return this._reserveId;
    }
    public get client(): Client | null {
        return this._client;
    }
    public get cancelationDate(): Date {
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
    public get table(): Mesa[] {
        return this._table;
    }

    public set client(client: Client) {
        this._client = client;
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
    public set table(table: Mesa) {
        this._table.push(table);   
    }
}