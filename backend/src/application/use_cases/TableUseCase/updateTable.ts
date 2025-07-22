import { Table } from "../../../domain/entities/Table.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { estadoMesa } from "../../../domain/interfaces/tableInterface.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class UpdateTable {
    constructor(
        private readonly tableRepository = new TableRepository
    ){}

    public async execute(numTable: number , state:estadoMesa ): Promise<Table>{
        const existingTable = await this.tableRepository.getByNumTable(numTable);
        if (!existingTable) {
            throw new NotFoundError(`El número de la mesa ${numTable} no se encontro`);
        }

        const updatedTable = await this.tableRepository.updateTable(numTable,state);
        return updatedTable;
    }
}