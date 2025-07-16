import { PrismaClient,Prisma } from "@prisma/client";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { SchemaReserve } from "../../../shared/validators/reserveZod.js";
import { IReserveRepository } from "../../../domain/repositories/IReserveRepository.js";
import { Client } from "../../../domain/entities/Client.js";
import { ClientState } from "../../../domain/entities/ClientState.js";
import { UUID } from "crypto";

const prisma = new PrismaClient();

type ReservationWithClient = Prisma.ReservaGetPayload<{
    include: { 
        Clientes: {
            include: {
                Usuarios: true,
                EstadosCliente: true
            }
        }
    }
}>;

export class ReserveRepository implements IReserveRepository {
    async createReserve(reserve: SchemaReserve): Promise<Reservation> {
        const createdReserve = await prisma.reserva.create({
            data: {
                fechaCancelacion: reserve.cancelationDate,
                fechaReserva: reserve.reserveDate,
                horarioReserva: new Date(`2000-01-01T${reserve.reserveTime}:00`),
                estado: reserve.status === "No Asistida" ? "No_Asistida" : reserve.status,
                idCliente: reserve.clientId.toString(),
                cantidadComensales: 1 // Valor por defecto
            },
            include: {
                Clientes: {
                    include: {
                        Usuarios: true,
                        EstadosCliente: true
                    }
                }
            }
        });
        return this.toDomainEntity(createdReserve);
    }

    async getReserveById(id: string): Promise<Reservation | null> {
        const reserve = await prisma.reserva.findUnique({
            where: { idReserva: parseInt(id) },
            include: {
                Clientes: {
                    include: {
                        Usuarios: true,
                        EstadosCliente: true
                    }
                }
            }
        });
        return reserve ? this.toDomainEntity(reserve) : null;
    }

    async getReservesByClientCompleteName(name: string, lastName: string): Promise<Reservation[]> {
        const reserves = await prisma.reserva.findMany({
            where: {
                Clientes: {
                    nombre: name,
                    apellido: lastName
                }
            },
            include: {
                Clientes: {
                    include: {
                        Usuarios: true,
                        EstadosCliente: true
                    }
                }
            }
        });
        return reserves.map((reserve) => this.toDomainEntity(reserve));
    }

    async getReservesByDate(date: string): Promise<Reservation[] | null> {
        const reserves = await prisma.reserva.findMany({
            where : { fechaReserva: new Date(date) }, 
            include: {
                Clientes: {
                    include: {
                        Usuarios: true,
                        EstadosCliente: true
                    }
                }
            }
        });

        if(!reserves || reserves.length === 0){
            return null
        }

        return reserves.map(reserve => this.toDomainEntity(reserve));
    }

    async updateReserve(id: string, reserve: SchemaReserve): Promise<Reservation | null> {
        const updatedReserve = await prisma.reserva.update({
            where: { idReserva: parseInt(id) },
            data: {
                fechaCancelacion: reserve.cancelationDate,
                fechaReserva: reserve.reserveDate,
                horarioReserva: new Date(`2000-01-01T${reserve.reserveTime}:00`),
                estado: reserve.status === "No Asistida" ? "No_Asistida" : reserve.status,
                idCliente: reserve.clientId.toString(),
            },
            include: {
                Clientes: {
                    include: {
                        Usuarios: true,
                        EstadosCliente: true
                    }
                }
            }
        });
        return updatedReserve ? this.toDomainEntity(updatedReserve) : null;
    }

    private toDomainEntity(reserve: ReservationWithClient): Reservation {
        const client = new Client(
            reserve.Clientes.Usuarios.idUsuario as UUID,
            reserve.Clientes.Usuarios.nombreUsuario,
            reserve.Clientes.Usuarios.email,
            reserve.Clientes.Usuarios.contrasenia,
            reserve.Clientes.Usuarios.tipoUsuario,
            reserve.Clientes.nombre,
            reserve.Clientes.apellido,
            reserve.Clientes.telefono,
            reserve.Clientes.fechaNacimiento,
            reserve.Clientes.EstadosCliente.map(estado => new ClientState(
                estado.fechaActualizacion,
                estado.estado
            )), // _states - mapear los estados del cliente usando la clase ClientState
            []  // _reservation - array vacío por ahora
        );

        return new Reservation(
            reserve.idReserva,
            client,
            reserve.fechaCancelacion || new Date(),
            reserve.horarioReserva.toTimeString().substring(0, 5), // Formato HH:MM
            reserve.fechaReserva,
            reserve.estado
        );
    }

}
