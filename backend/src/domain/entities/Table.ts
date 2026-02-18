import { TableState } from "../../shared/types/SharedTypes.js";

export class Table  {
    constructor(
        private readonly _tableNum : number, 
        private _capacity: number, 
        private _state: TableState,
        private _orders?: any[]  // Agregado para incluir los pedidos asociados a la mesa
    ){}

    public get tableNum(): number { return this._tableNum } 
    public get capacity (): number { return this._capacity }
    public get state (): TableState { return this._state }
    public get orders (): any[] | undefined { return this._orders }

    public set capacity(capacity: number) {
        this._capacity = capacity;
    }

    public set state(state: TableState) { 
        this._state = state;
    }
}