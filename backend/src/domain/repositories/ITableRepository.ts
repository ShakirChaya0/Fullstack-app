import { Table } from "../entities/Table.js";
import { schemaTable } from "../../shared/validators/TableZod.js";

export interface ITableRepository {
    getAll() : Promise<Table[]>; 
    getByNumTable(numTable: number): Promise<Table | null>; 
    getTableByCapacity (capa: number): Promise<Table[] | null>;
    createTable(table: schemaTable): Promise<Table>;
    updateTableBusy(tables: Table[]): Promise<Table[]>;
    updateTableFree(tables: Table[]): Promise<Table[]>;
    updateTable(numTable: number): Promise<Table | null>;
    deleteTable(numTable: number): Promise<void>;
    getAvailableTables(reservationDate: Date, reservationTime: string): Promise<Table[]>;
}