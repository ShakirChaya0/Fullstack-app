import { OrderStatus } from "../../shared/types/SharedTypes.js";
import { OrderClientInfo } from "../interfaces/OrderClientInfo.js";
import { OrderKitchenInfo } from "../interfaces/OrderKitchenInfo.js";
import { OrderWaiterInfo } from "../interfaces/OrderWaiterInfo.js";
import { WaiterPublicInfo } from "../interfaces/WaiterPublicInfo.js";
import { OrderLine } from "./OrderLine.js";
import { Table } from "./Table.js";


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

    public toKitchenInfo(): OrderKitchenInfo {
        return { 
            idPedido: this._orderId, 
            horaInicio: this._startHour,
            lineasPedido: this._orderLines.map(ol => {
                return {
                    nombreProducto: ol.productoVO.productName,
                    tipoComida: ol.productoVO.foodType,
                    cantidad: ol.amount,
                    estado: ol.status
                }
            }),
            estado: this._status,
            observaciones: this._observation
        }
    }

    public toWaiterInfo(): OrderWaiterInfo {
        return { 
            idPedido: this._orderId, 
            horaInicio: this._startHour,
            nroMesa: this._table!.tableNum,
            cantidadCubiertos: this._cutleryAmount,
            lineasPedido: this._orderLines.map(ol => {
                return {
                    nombreProducto: ol.productoVO.productName,
                    cantidad: ol.amount,
                    estado: ol.status,
                    nroLinea: ol.lineNumber
                }
            }),
            estado: this._status,
            observaciones: this._observation
        }
    }

    public toClientInfo(): OrderClientInfo {
        return {
            idPedido: this._orderId,
            lineasPedido: this._orderLines.map(ol => {
                return {
                    nombreProducto: ol.productoVO.productName,
                    tipoComida: ol.productoVO.foodType,
                    cantidad: ol.amount,
                    estado: ol.status
                }
            }),
            estado: this._status,
            observaciones: this._observation
        }
    }
}