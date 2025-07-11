import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";

export class DeleteTable {
    constructor (
        private readonly tableRepository = new TableRepository
    ) {}

    public async execute (nroMesa : number): Promise<{ message: string }> {
        return await this.tableRepository.deleteTable(nroMesa);
    }
}