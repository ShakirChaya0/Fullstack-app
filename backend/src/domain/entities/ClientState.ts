import { stateClient } from "../../shared/types/SharedTypes.js"

export class ClientState {
    constructor(
        private _modifyDate: Date,
        private _state: stateClient
    ) {}

    get modifyDate() { return this._modifyDate}
    get state() { return this._state}

    set modifyDate(date: Date){ this._modifyDate = date }
    set state( state: stateClient) { this._state = state }
}