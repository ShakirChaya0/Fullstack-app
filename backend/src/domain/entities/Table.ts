
export type TableState = "Libre" | "Ocupada"; 

export class Table  {
    constructor(
        private readonly _tableNum : number, 
        private _capacity: number, 
        private _state: TableState
    ){}

    public get tableNum() : number {return this._tableNum} 
    public get capacity () : number {return this._capacity}
    public get state () : TableState {return this._state}

    public set capacity(capacity :number) {
        this._capacity = capacity;
    }

    public set state(state: TableState) { 
        this._state = state;
    }
}