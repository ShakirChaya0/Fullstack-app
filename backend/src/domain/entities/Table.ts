import { validatePartialTable, validateTable } from "../../shared/validators/tableZod.js";

export type TableState = "Libre" | "Ocupado" | "Reservado"; 

export class Table  {
    constructor(
        private readonly _tableNum : number, 
        private _capacity: number, 
        private _state: TableState
    ){validateTable(this)}

    public get tableNum() : number {return this._tableNum} 
    public get capacity () : number {return this._capacity}
    public get state () : TableState {return this._state}

    public set capacity(capacity :number) {
        validatePartialTable({capacity}); 
        this._capacity = capacity;
    }

    public set state(state: TableState) {
        validatePartialTable({state}); 
        this._state = state;
    }
}