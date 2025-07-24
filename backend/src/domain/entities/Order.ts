import { UUID } from "crypto";

export type OrderStatus = 'Solicitado' | 'En Preparación' | 'Completado' | 'Pendiente De Pago' | 'Pagado';

export class Order {
    constructor(
        private readonly _idPedido: number,
        private _horaInicio: string,
        private _estado: OrderStatus,
        private _cantCubiertos: number,
        private _observaciones: string,
        private _nroMesa: number,
        private _idMozo: UUID
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

    get nroMesa(): number {
        return this._nroMesa;
    }

    get idMozo(): UUID {
        return this._idMozo;
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