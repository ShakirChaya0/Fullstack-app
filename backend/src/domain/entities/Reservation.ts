import { Client } from "./Client.js";
import { EstadoReserva } from "@prisma/client";

export class Reservation {
    constructor(
        private readonly _reserveId: number,
        private _client: Client,
        private _cancelationDate: Date,
        private _reserveTime: string,
        private _reserveDate: Date,
        private _status: EstadoReserva,
        private _tableIds: number[],
    ) {}

    public get reserveId(): number {
        return this._reserveId;
    }
    public get client(): Client {
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
    public get status(): EstadoReserva {
        return this._status;
    }
    public get tableIds(): number[] {
        return this._tableIds;
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
    public set status(status: EstadoReserva) {
        this._status = status;
    }
    public set tableIds(tableIds: number) {
        this._tableIds.push(tableIds);
    }
}