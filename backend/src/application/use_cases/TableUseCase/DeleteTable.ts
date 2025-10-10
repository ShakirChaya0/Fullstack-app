import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { BusinessError } from "../../../shared/exceptions/BusinessError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class DeleteTable {
    constructor (
        private readonly tableRepository = new TableRepository
    ) {}

    public async execute (numTable: number): Promise<void> {
        const tableFound = await this.tableRepository.getByNumTable(numTable);
        
        if (!tableFound) throw new NotFoundError("Mesa no encontrada");

        if(tableFound.state == 'Ocupada') throw new BusinessError('No puedes eliminar una mesa que se encuntra ocupada.')

        await this.tableRepository.deleteTable(numTable);
    }
}