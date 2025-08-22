import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";



export class UpdateTableUseCase {
    constructor(
        private readonly tableRepository = new TableRepository()
    ) {}

    public async execute(numTable: number): Promise<void> {
        const table = await this.tableRepository.updateTable(numTable); 
        if(!table) throw new NotFoundError('La mesa no se encontró');
    } 
}