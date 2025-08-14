import { Table } from "../../../domain/entities/Table.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetTableByCapacity {
    constructor (
        private readonly tableRepository = new TableRepository
    ){}

    public async execute (capacity: number) : Promise<Table[] | null> {
        const tables = await this.tableRepository.getTableByCapacity(capacity)

        if (!tables) throw new NotFoundError("No hay mesas para la capacidad solicitada");

        return tables;
    }   
}