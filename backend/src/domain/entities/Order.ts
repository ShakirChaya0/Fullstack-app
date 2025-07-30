import { WaiterPublicInfo } from "../interfaces/waiterPublicInfo.js";
import { OrderLine } from "./OrderLine.js";
import { Table } from "./Table.js";

export type OrderStatus = 'Solicitado' | 'En_Preparacion' | 'Completado' | 'Pendiente_De_Pago' | 'Pendiente_De_Cobro' | 'Pagado';

export class Order {
    constructor(
        private readonly _idPedido: number,
        private _horaInicio: string,
        private _estado: OrderStatus,
        private _cantCubiertos: number,
        private _observaciones: string,
        private _orderLines: OrderLine[],
        private _table?: Table,
        private _waiter?: WaiterPublicInfo
    ) {} 

    get idPedido(): number {
        return this._idPedido;
    }

    get horaInicio(): string {
        return this._horaInicio;
    }

    get estado(): OrderStatus {
        return this._estado;
    }

    get cantCubiertos(): number {
        return this._cantCubiertos;
    }

    get observaciones(): string {
        return this._observaciones;
    }

    get table(): Table | undefined {
        return this._table;
    }

    get waiter(): WaiterPublicInfo | undefined {
        return this._waiter;
    }

    get orderLines(): OrderLine[] {
        return this._orderLines;
    }

    set horaInicio(horaInicio: string) {
        this._horaInicio = horaInicio;
    }

    set estado(estado: OrderStatus) {
        this._estado = estado;
    }

    set cantCubiertos(cantCubiertos: number) {
        this._cantCubiertos = cantCubiertos;
    }

    set observaciones(observaciones: string) {
        this._observaciones = observaciones;
    }
}