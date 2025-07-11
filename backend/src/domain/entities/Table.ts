import { validatePartialTable, validateTable } from "../../presentation/validators/tableZod.js";

export type TableState = "Libre" | "Ocupado" | "Reservado"; 

export class Table  {
    constructor(
        private readonly _tableNum : number, 
        private _capacity: number, 
        private _state: TableState
    ){validateTable(this)}

    public get nroMesa() : number {return this._tableNum} 
    public get capacidad () : number {return this._capacity}
    public get estado () : TableState {return this._state}

    public set capacity(capacidad :number) {
        validatePartialTable({capacidad}); 
        this._capacity = capacidad;
    }

    public set state(estado: TableState) {
        validatePartialTable({estado}); 
        this._state = estado;
    }
}