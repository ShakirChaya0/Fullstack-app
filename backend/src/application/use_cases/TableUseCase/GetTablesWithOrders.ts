import { Table } from "../../../domain/entities/Table.js";
import { JwtPayloadInterface } from "../../../domain/interfaces/JwtPayloadInterface.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";

export class GetTablesWithOrders {
    constructor(
        private readonly tableRepository = new TableRepository
    ){}

    public async execute (user: JwtPayloadInterface | undefined) : Promise<Table[]> {
        return await this.tableRepository.getWithOrders(user);
    }
}