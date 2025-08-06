import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { Prisma } from "@prisma/client";

export class DeleteTable {
    constructor (
        private readonly tableRepository = new TableRepository
    ) {}

    public async execute (numTable : number): Promise<void> {
        try {
            await this.tableRepository.deleteTable(numTable);
        } catch (error){
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025')
                throw new NotFoundError("Mesa no encontrada");
            throw error;
        }
    }
}