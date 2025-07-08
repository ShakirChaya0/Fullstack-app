import { Table } from "../../../domain/entities/Table.js";
import {schemaTable } from "../../../presentation/validators/tableZod.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";

export class CUU17RegisterTable {
    constructor (
        private readonly tableRepository = new TableRepository
    ){}

    public async execute (table: schemaTable) : Promise<Table>{
        const existingTable = await this.tableRepository.create(table);
        return existingTable;
    }
}