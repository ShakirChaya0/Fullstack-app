import { Table } from "../../../domain/entities/Table.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { SchemaPartialTable } from "../../../presentation/validators/tableZod.js";

export class UpdateTable {
    constructor(
        private readonly tableRepository = new TableRepository
    ){}

    public async execute(numTable: number , table: SchemaPartialTable): Promise<Table>{
        const existingTable = await this.tableRepository.getByNumTable(numTable);
        if (!existingTable) {
            throw new Error(`El número de la mesa ${numTable} no se encontro`);
        }

        const updatedData = {
            ...existingTable,
            ...table,
        };

        const draft = {
            capacidad: updatedData.capacidad, 
            estado: updatedData.estado
        }

        const updatedTable = await this.tableRepository.updateTable(numTable,draft);
        return updatedTable;
    }
}