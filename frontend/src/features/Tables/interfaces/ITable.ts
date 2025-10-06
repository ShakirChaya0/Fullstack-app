export type statusTable = 'Libre' |'Ocupada';

export interface ITable {
    readonly _tableNum: number, 
    _capacity: number, 
    _state: statusTable
}
