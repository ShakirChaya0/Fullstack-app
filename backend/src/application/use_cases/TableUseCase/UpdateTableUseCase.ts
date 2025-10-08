import { Table } from "../../../domain/entities/Table.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { TableState } from "../../../shared/types/SharedTypes.js";



export class UpdateTableUseCase {
    constructor(
        private readonly tableRepository = new TableRepository()
    ) {}

    public async execute(numTable: number, statusTable: TableState): Promise<Table> {
        const table = await this.tableRepository.updateTable(numTable,statusTable); 
        if(!table) throw new NotFoundError('La mesa no se encontró');

        return table;
    } 
}