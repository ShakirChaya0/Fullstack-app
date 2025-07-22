import { Table } from "../entities/Table.js";
import { schemaTable } from "../../shared/validators/tableZod.js";
import { estadoMesa } from "../interfaces/tableInterface.js";

export interface ITableRepository {
    getALL() : Promise<Table[]>; 
    getByNumTable(numTable: number) : Promise<Table | null>; 
    getTableByCapacity (capa:number) :Promise<Table[] | null>;
    createTable(table: schemaTable): Promise<Table>;
    updateTable(numTable:number, stateTable: estadoMesa ) : Promise<Table>;
    deleteTable(numTable: number): Promise<void>;
}