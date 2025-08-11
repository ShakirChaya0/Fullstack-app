import { Table } from "../../../domain/entities/Table.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";

export class GetAllTable {
    constructor(
        private readonly tableRepository = new TableRepository
    ){}

    public async execute () : Promise<Table[]> {
        return await this.tableRepository.getAll();
    }
}