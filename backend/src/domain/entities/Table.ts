export type TableState = "Libre" | "Ocupado" | "Reservado"; 

export class Table {
    constructor(
        private readonly _tableNum : number, 
        private _capacity: number, 
        private _state: TableState
    ){}

    public get tableNum() {return this._tableNum} 
    public get capacity () {return this._capacity}
    public get state () {return this._state}

    public set capacity(capacity:number) {
        if(capacity > 0 ){
            this._capacity = capacity;
        }
        else {
            throw new Error ("La capacidad debe ser mayor a 0");
        }
    }

    public set state(state: TableState) {
        if(state !== "Libre" && state !== "Ocupado" && state !== "Reservado"){
            throw new Error ("El estado de la mesa debe ser Libre o Reservado o Ocupado");
        }
        this._state = state;
    }
}