import { PrismaClient,Prisma } from "@prisma/client";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { SchemaReservation } from "../../../shared/validators/reservationZod.js";
import { IReservationRepository } from "../../../domain/repositories/IReservationRepository.js";
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

export class ReservationRepository implements IReservationRepository {
    async createReservation(reservation: SchemaReservation): Promise<Reservation> {
        const createdReservation = await prisma.reserva.create({
            data: {
                fechaCancelacion: reservation.cancelationDate,
                fechaReserva: reservation.reservationDate,
                horarioReserva: new Date(`2000-01-01T${reservation.reservationTime}:00`),
                estado: reservation.status === "No Asistida" ? "No_Asistida" : reservation.status,
                idCliente: reservation.clientId.toString(),
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
        return this.toDomainEntity(createdReservation);
    }

    async getReservationById(id: string): Promise<Reservation | null> {
        const reservation = await prisma.reserva.findUnique({
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
        return reservation ? this.toDomainEntity(reservation) : null;
    }

    async getReservationsByClientCompleteName(name: string, lastName: string): Promise<Reservation[]> {
        const reservations = await prisma.reserva.findMany({
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
        return reservations.map((reservation) => this.toDomainEntity(reservation));
    }

    async getReservationsByDate(date: string): Promise<Reservation[] | null> {
        const reservations = await prisma.reserva.findMany({
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

        if(!reservations || reservations.length === 0){
            return null
        }

        return reservations.map(reservation => this.toDomainEntity(reservation));
    }

    async updateReservation(id: string, reservation: SchemaReservation): Promise<Reservation | null> {
        const updatedReservation = await prisma.reserva.update({
            where: { idReserva: parseInt(id) },
            data: {
                fechaCancelacion: reservation.cancelationDate,
                fechaReserva: reservation.reservationDate,
                horarioReserva: new Date(`2000-01-01T${reservation.reservationTime}:00`),
                estado: reservation.status === "No Asistida" ? "No_Asistida" : reservation.status,
                idCliente: reservation.clientId.toString(),
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
        return updatedReservation ? this.toDomainEntity(updatedReservation) : null;
    }

    private toDomainEntity(reservation: ReservationWithClient): Reservation {
        const client = new Client(
            reservation.Clientes.Usuarios.idUsuario as UUID,
            reservation.Clientes.Usuarios.nombreUsuario,
            reservation.Clientes.Usuarios.email,
            reservation.Clientes.Usuarios.contrasenia,
            reservation.Clientes.Usuarios.tipoUsuario,
            reservation.Clientes.nombre,
            reservation.Clientes.apellido,
            reservation.Clientes.telefono,
            reservation.Clientes.fechaNacimiento,
            reservation.Clientes.EstadosCliente.map(estado => new ClientState(
                estado.fechaActualizacion,
                estado.estado
            )), 
            []
        );

        return new Reservation(
            reservation.idReserva,
            client,
            reservation.fechaCancelacion || new Date(),
            reservation.horarioReserva.toTimeString().substring(0, 5), // Formato HH:MM
            reservation.fechaReserva,
            reservation.estado
        );
    }

}
