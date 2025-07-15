import { EstadoCliente } from "@prisma/client";

export class ClientState {
    constructor(
        private _modifyDate: Date,
        private _state: EstadoCliente
    ) {}

    get modifyDate() { return this._modifyDate}
    get state() { return this._state}

    set modifyDate(fecha: Date){
        this._modifyDate = fecha
    }
    set state( estado: EstadoCliente) {
        this._state = estado
    }
}