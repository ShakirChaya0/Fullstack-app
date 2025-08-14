import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class DeleteTable {
    constructor (
        private readonly tableRepository = new TableRepository
    ) {}

    public async execute (numTable : number): Promise<void> {
        const tableFound = await this.tableRepository.getByNumTable(numTable);

        if (!tableFound) throw new NotFoundError("Mesa no encontrada");

        await this.tableRepository.deleteTable(numTable);
    }
}