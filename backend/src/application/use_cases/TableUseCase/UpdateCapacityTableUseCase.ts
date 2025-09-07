import { Table } from "../../../domain/entities/Table.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class UpdateCapacityTableUseCase {
    constructor(
        private readonly tableRepository = new TableRepository()
    ) {}

    public async execute(numTable: number, newCapacity: number): Promise<Table> {
        const table = await this.tableRepository.updateCapacityTable(numTable, newCapacity); 
        if(!table) throw new NotFoundError('La mesa no se encontró');

        return table
    } 
}