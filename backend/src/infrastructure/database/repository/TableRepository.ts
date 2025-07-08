import { PrismaClient } from "@prisma/client";
import { Table } from "../../../domain/entities/Table.js";
import { schemaTable } from "../../../presentation/validators/tableZod.js";

const prisma = new PrismaClient;

export class TableRepository {
    
    public async create(table: schemaTable): Promise<Table> {
        const newTable = await prisma.mesa.create({
            data: {
                capacidad: table.capacity,
                estado: table.state
            }
        });
        return new Table(newTable.nroMesa,newTable.capacidad,newTable.estado);
    } 
}