import { PrismaClient } from "@prisma/client";
import { Table } from "../../../domain/entities/Table.js";
import { schemaTable, SchemaPartialTable } from "../../../presentation/validators/tableZod.js";


const prisma = new PrismaClient;

export class TableRepository {
    
    public async getAll () :Promise<Table[]> {
        const tables = await prisma.mesa.findMany();
            return tables.map(table => new Table (
                table.nroMesa, 
                table.capacidad,
                table.estado
            )
        )
    }

    public async getByNumTable (numTable: number) : Promise<Table> {
        const table = await prisma.mesa.findUnique({
            where: {nroMesa: numTable}
        }); 

        if(!table) {
            throw new Error(`No se encontro un la mesa con el numero de mesa: ${numTable}`);
        }

        return new Table (
            table.nroMesa, 
            table.capacidad,
            table.estado
        );
    }

    public async getTableByCapacity (capa:number) :Promise<Table[] | null> {
        const tableCapacity = await prisma.mesa.findMany({
            where: {
                capacidad: {
                    gte: capa
                },
                estado: "Libre"
                },
            orderBy: {
                capacidad: 'asc'
            }
        });
        if(tableCapacity !== null) {
            return tableCapacity.map(table => new Table (
                table.nroMesa,
                table.capacidad,
                table.estado 
            ))
        } else {
            return null;
        }
    }

    public async createTable(table: schemaTable): Promise<Table> {
        const newTable = await prisma.mesa.create({
            data: {
                capacidad: table.capacidad,
                estado: table.estado
            }
        });
        return new Table(newTable.nroMesa,newTable.capacidad,newTable.estado);
    } 

    public async updateTable(numTable:number, table: SchemaPartialTable ) : Promise<Table> {
        const updatedTable = await prisma.mesa.update({
            where: { nroMesa: numTable },
            data: {
                ...table
            }
        });
        return new Table (
            updatedTable.nroMesa,
            updatedTable.capacidad,
            updatedTable.estado
        )
    }

    public async deleteTable(numTable: number) {
        const deleteTable = await prisma.mesa.delete({
            where: {nroMesa: numTable}
        }); 
        if (!deleteTable) {
            throw new Error(`No se pudo eliminar la mesa con el número de mesa: ${numTable}`);
        }
        return { message: `Mesa con el numero ${numTable} eliminado correctamente` };
    }

}