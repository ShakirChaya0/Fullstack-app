export type statusTable = 'Libre' |'Ocupda';

export interface ITable {
    readonly _tableNum: number, 
    _capacity: number, 
    _state: statusTable
}
