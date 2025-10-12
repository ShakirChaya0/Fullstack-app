import prisma from "../prisma/PrismaClientConnection.js"
import { Table } from "../../../domain/entities/Table.js";
import { schemaTable } from "../../../shared/validators/TableZod.js";
import { ITableRepository } from "../../../domain/repositories/ITableRepository.js";
import { TableState } from "../../../shared/types/SharedTypes.js";

export class TableRepository implements ITableRepository {
    
    public async getAll(): Promise<Table[]> {
        const tables = await prisma.mesa.findMany();
            return tables.map(table => new Table (
                table.nroMesa, 
                table.capacidad,
                table.estado
            )
        )
    }

    public async getWithOrders(): Promise<Table[]> {
       const tables = await prisma.mesa.findMany({
            include: {
                Pedido: {
                    include: {
                        Linea_De_Pedido: true,
                    }
                }
            }
        });
        return tables.map(table => new Table (
                table.nroMesa, 
                table.capacidad,
                table.estado,
                table.Pedido.map(p => ({
                    idPedido: p.idPedido,
                    horaInicio: p.horaInicio,
                    nroMesa: p.nroMesa,
                    cantidadCubiertos: p.cantCubiertos,
                    lineasPedido: p.Linea_De_Pedido.map(lp => ({
                        nombreProducto: lp.nombreProducto,
                        cantidad: lp.cantidad,
                        estado: lp.estado
                    })),
                    estado: p.estado,
                    observaciones: p.observaciones,
                    idMozo: p.idMozo
                }))
            )
        )
    }

    public async getByNumTable(numTable: number): Promise<Table | null> {
        const table = await prisma.mesa.findUnique({
            where: { nroMesa: numTable }
        }); 

        if(!table) return null;

        return new Table (
            table.nroMesa, 
            table.capacidad,
            table.estado
        );
    }

    public async getTableByCapacity(capa:number): Promise<Table[] | null> {
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

        if(tableCapacity.length === 0) return null;

        return tableCapacity.map(table => new Table (
            table.nroMesa,
            table.capacidad,
            table.estado 
        ))
    }

    public async createTable(table: schemaTable): Promise<Table> {
        const newTable = await prisma.mesa.create({
            data: {
                capacidad: table.capacity,
                estado: 'Libre'
            }
        });

        return new Table(newTable.nroMesa,newTable.capacidad,newTable.estado);
    } 

    public async updateTableBusy(tables: Table[]): Promise<Table[]> {
        const updatedTables: Table[] = [];

        for (const table of tables) {
            const updated = await prisma.mesa.update({
                where: { nroMesa: table.tableNum },
                data: {
                    estado: 'Ocupada'
                }
            });

            updatedTables.push(new Table(
                updated.nroMesa,
                updated.capacidad,
                updated.estado
            ));
        }

        return updatedTables;
    }
    
    public async updateTableFree(tables:Table[]): Promise<Table[]> {
        const updatedTables: Table[] = [];

        for (const table of tables) {
            const updated = await prisma.mesa.update({
                where: { nroMesa: table.tableNum },
                data: {
                    estado: 'Libre'
                }
            });

            updatedTables.push(new Table(
                updated.nroMesa,
                updated.capacidad,
                updated.estado
            ));
        }

        return updatedTables;
    }

    public async updateTable(numTable: number, status: TableState): Promise<Table | null> {
        const table = await prisma.mesa.update({
            where: {
                nroMesa: numTable
            }, 
            data: {
                estado: status
            }
        });

        if (!table) return null;

        return new Table(table.nroMesa, table.capacidad, table.estado);
    }

    public async deleteTable(numTable: number): Promise<void> {
        await prisma.mesa.delete({
            where: { nroMesa: numTable }
        }); 
    }

    public async updateCapacityTable(numTable: number, newCapacity: number): Promise<Table | null> {
        const updatedTable = await prisma.mesa.update({
            where: {nroMesa: numTable}, 
            data: {
                capacidad: newCapacity
            }
        });

        if (!updatedTable) return null;

        return new Table(updatedTable.nroMesa, updatedTable.capacidad, updatedTable.estado);
    }   

    public async getAvailableTables(reservationDate: Date, reservationTime: string): Promise<Table[]> {
        const [hours, minutes] = reservationTime.split(':').map(Number);
        const timeAsDate = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));

        const availableTables = await prisma.mesa.findMany({
            where: {
                Mesas_Reservas: {
                    none: {
                        Reserva: {
                            fechaReserva: reservationDate, 
                            horarioReserva: timeAsDate      
                        }
                    }
                }
            },
            orderBy: { capacidad: "asc" }
        });
    
        return availableTables.map(table => new Table(
            table.nroMesa,
            table.capacidad,
            table.estado 
        ));
    }   
}