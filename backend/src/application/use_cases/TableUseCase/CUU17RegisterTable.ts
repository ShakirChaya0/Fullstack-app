import { Table } from "../../../domain/entities/Table.js";
import {schemaTable } from "../../../shared/validators/TableZod.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";

export class CUU17RegisterTable {
    constructor (
        private readonly tableRepository = new TableRepository
    ){}

    public async execute (table: schemaTable) : Promise<Table>{
        const existingTable = await this.tableRepository.createTable(table);
        return existingTable;
    }
}