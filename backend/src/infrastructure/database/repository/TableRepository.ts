import { PrismaClient } from "@prisma/client";
import { Table } from "../../../domain/entities/Table.js";
import { schemaTable } from "../../../shared/validators/tableZod.js";
import { estadoMesa } from "../../../domain/interfaces/tableInterface.js";


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

    public async getByNumTable (numTable: number) : Promise<Table | null> {
        const table = await prisma.mesa.findUnique({
            where: {nroMesa: numTable}
        }); 

        if(!table) {
            return null;
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

    public async updateTable(numTable:number, stateTable: estadoMesa ) : Promise<Table> {
        const updatedTable = await prisma.mesa.update({
            where: { nroMesa: numTable },
            data: {
                estado : stateTable
            }
        });
        return new Table (
            updatedTable.nroMesa,
            updatedTable.capacidad,
            updatedTable.estado
        )
    }

    public async deleteTable(numTable: number): Promise<void> {
        await prisma.mesa.delete({
            where: {nroMesa: numTable}
        }); 
    }

    public async getAvailableTables(reservationDate: Date, reservationTime: string): Promise<Table[]> {
    const tables = await prisma.mesa.findMany({
        where: {
        Mesas_Reservas: {
            none: {
            Reserva: {
                AND: [
                { fechaReserva: reservationDate },
                { horarioReserva: new Date(`2000-01-01T${reservationTime}:00Z`) },
                { estado: { notIn: ["Cancelada", "No_Asistida", "Asistida"] } },
                ]
            }
            }
        }
        },
        orderBy: { capacidad: "desc" },
    });

    return tables.map(table => new Table (
                table.nroMesa,
                table.capacidad,
                table.estado 
            ))
    }

}