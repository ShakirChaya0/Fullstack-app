import { Mesa, PrismaClient } from "@prisma/client";
import { Table } from "../../../domain/entities/Table.js";
import { schemaTable, SchemaPartialTable } from "../../../shared/validators/tableZod.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";


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
            throw new NotFoundError(`No se encontro un la mesa con el numero de mesa: ${numTable}`);
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

    public async deleteTable(numTable: number): Promise<{ message: string }> {
        const deleteTable = await prisma.mesa.delete({
            where: {nroMesa: numTable}
        }); 
        if (!deleteTable) {
            throw new NotFoundError("Mesa no encontrada");
        }
        return { message: `Mesa con el numero ${numTable} eliminado correctamente` };
    }
    public async getAvailableTables(
      reservationDate: Date,
      reservationTime: string
    ) {
      return prisma.mesa.findMany({
        where: {
          Mesas_Reservas: {
            none: {
              Reserva: {
                fechaReserva: reservationDate,
                horarioReserva: reservationTime,
                estado: { notIn: ["Cancelada", "No_Asistida"] as any },
              },
            },
          },
        },
        orderBy: { nroMesa: "asc" },
      });
    }
}