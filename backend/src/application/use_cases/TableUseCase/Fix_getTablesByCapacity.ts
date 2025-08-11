import { Table } from "../../../domain/entities/Table.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";

export class GetTableByCapacity {

    constructor (
        private readonly tableRepository = new TableRepository
    ){}

    public async execute (capacity: number) : Promise<Table[] | null> {
        return await this.tableRepository.getTableByCapacity(capacity)
    }   
}