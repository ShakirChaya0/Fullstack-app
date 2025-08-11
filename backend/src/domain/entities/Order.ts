import { WaiterPublicInfo } from "../interfaces/Fix_waiterPublicInfo.js";
import { OrderLine } from "./OrderLine.js";
import { Table } from "./Table.js";

export type OrderStatus = 'Solicitado' | 'En_Preparacion' | 'Completado' | 'Pendiente_De_Pago' | 'Pendiente_De_Cobro' | 'Pagado';

export class Order {
    constructor(
        private readonly _orderId: number,
        private _startHour: string,
        private _status: OrderStatus,
        private _cutleryAmount: number,
        private _observation: string,
        private _orderLines: OrderLine[],
        private _table?: Table,
        private _waiter?: WaiterPublicInfo
    ) {} 

    get orderId(): number {
        return this._orderId;
    }

    get startHour(): string {
        return this._startHour;
    }

    get status(): OrderStatus {
        return this._status;
    }

    get cutleryAmount(): number {
        return this._cutleryAmount;
    }

    get observation(): string {
        return this._observation;
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

    set startHour(startHour: string) {
        this._startHour = startHour;
    }

    set status(status: OrderStatus) {
        this._status = status;
    }

    set cutleryAmount(cutleryAmount: number) {
        this._cutleryAmount = cutleryAmount;
    }

    set observation(observation: string) {
        this._observation = observation;
    }

    public calculateCutleryTotal(cutleryPrice: number): number {
        return this._cutleryAmount * cutleryPrice;
    }

    public calculateTotal(iva: number): { subtotal: number, importeImpuestos: number, total: number } {
        let subtotal = 0;
        this._orderLines.forEach(l => {
            subtotal += l.calculateSubtotal();
        });

        const importeImpuestos = subtotal * (iva / 100);
        const total = subtotal + importeImpuestos;
        return { subtotal, importeImpuestos, total }
    }
}