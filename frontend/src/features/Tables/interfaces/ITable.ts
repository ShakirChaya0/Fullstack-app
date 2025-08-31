export type statusTable = 'Libre' |'Ocupda';

export interface ITable {
    readonly _numTable: number, 
    _capacity: number, 
    _status: statusTable
}
