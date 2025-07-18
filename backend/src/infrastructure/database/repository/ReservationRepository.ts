import { PrismaClient,Prisma } from "@prisma/client";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { PartialSchemaReservation, SchemaReservation } from "../../../shared/validators/reservationZod.js";
import { IReservationRepository } from "../../../domain/repositories/IReservationRepository.js";
// import { Client } from "../../../domain/entities/Client.js";
// import { ClientState } from "../../../domain/entities/ClientState.js";
// import { UUID } from "crypto";
import { EstadoReserva } from "@prisma/client";

const prisma = new PrismaClient();

type ReservationWithClient = Prisma.ReservaGetPayload<{
  include: { 
    Clientes: {
      include: {
        Usuarios: true,
        EstadosCliente: true,
        Reserva: true,
      },
    },
    Mesas_Reservas: {
      include: {
        Mesa: true;
      },
    },
  },
}>;


export class ReservationRepository implements IReservationRepository {
    async create(reservation: SchemaReservation, clientId: string): Promise<Reservation> {
        const createdReservation = await prisma.reserva.create({
            data: {
              fechaReserva: reservation.fechaReserva,
              horarioReserva: new Date(`2000-01-01T${reservation.horarioReserva}:00Z`),
              fechaCancelacion: reservation.fechaCancelacion,
              cantidadComensales: reservation.cantidadComensales, 
              estado: "Realizada",
              idCliente: clientId,
            },
            include: { 
              Clientes: {
                include: {
                  Usuarios: true,
                  EstadosCliente: true,
                  Reserva: true,
                },
              },
              Mesas_Reservas: {
                include: {
                  Mesa: true
                },
              },
            },
        });
        return this.toDomainEntity(createdReservation);
    }

    async getById(id: number): Promise<Reservation | null> {
        const reservation = await prisma.reserva.findUnique({
            where: { idReserva: id },
            include: { 
              Clientes: {
                include: {
                  Usuarios: true,
                  EstadosCliente: true,
                  Reserva: true,
                },
              },
              Mesas_Reservas: {
                include: {
                  Mesa: true
                },
              },
            },
        });
        return reservation ? this.toDomainEntity(reservation) : null;
    }

    async getByClientCompleteName(name: string, lastName: string): Promise<Reservation[]> {
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
                  EstadosCliente: true,
                  Reserva: true,
                },
              },
              Mesas_Reservas: {
                include: {
                  Mesa: true
                },
              },
            },
        });
        return reservations.map((reservation) => this.toDomainEntity(reservation));
    }

    
    async getByDate(date: Date): Promise<Reservation[]> {
        const reservations = await prisma.reserva.findMany({
            where : { fechaReserva: new Date(date) }, 
            include: { 
              Clientes: {
                include: {
                  Usuarios: true,
                  EstadosCliente: true,
                  Reserva: true,
                },
              },
              Mesas_Reservas: {
                include: {
                  Mesa: true
                },
              },
            },
        });
        return reservations.map(reservation => this.toDomainEntity(reservation));
    }


    async update(id: number, reservation: PartialSchemaReservation): Promise<Reservation | null> {
        const updatedReservation = await prisma.reserva.update({
            where: { idReserva: id},
            data: {
                fechaCancelacion: reservation.fechaCancelacion,
                fechaReserva: reservation.fechaReserva,
                horarioReserva: new Date(`2000-01-01T${reservation.horarioReserva}:00Z`),
                cantidadComensales: reservation.cantidadComensales,
                estado: reservation.estado === "No Asistida" ? "No_Asistida" : reservation.estado,

            },
            include: { 
              Clientes: {
                include: {
                  Usuarios: true,
                  EstadosCliente: true,
                  Reserva: true,
                },
              },
              Mesas_Reservas: {
                include: {
                  Mesa: true
                },
              },
            },
        });
        return updatedReservation ? this.toDomainEntity(updatedReservation) : null;
    }


    async updateStatus(id: number, status: EstadoReserva): Promise<Reservation> {
      const updatedReservation = await prisma.reserva.update({
            where: { idReserva: id },
            data: {
                estado: status,
                fechaCancelacion: status === "Cancelada" ? new Date() : null,
            },
            include: { 
              Clientes: {
                include: {
                  Usuarios: true,
                  EstadosCliente: true,
                  Reserva: true,
                },
              },
              Mesas_Reservas: {
                include: {
                  Mesa: true
                },
              },
            },
    })
        return this.toDomainEntity(updatedReservation);
  }
    
    
      async getByClientId(clientId: string): Promise<Reservation[]> {
        const reservations = await prisma.reserva.findMany({
            where: { idCliente: clientId.toString() },
            include: { 
              Clientes: {
                include: {
                  Usuarios: true,
                  EstadosCliente: true,
                  Reserva: true,
                },
              },
              Mesas_Reservas: {
                include: {
                  Mesa: true
                },
              },
            },
        });
        return reservations.map((reservation) => this.toDomainEntity(reservation));
    }
    




    private toDomainEntity(reservation: ReservationWithClient): Reservation {
      // const reservasCliente = reservation.Clientes.Reserva.map(r =>
      //   new Reservation(
      //     r.idReserva,
      //     r.fechaReserva,
      //     r.horarioReserva.toTimeString().substring(0, 5),
      //     r.fechaCancelacion || new Date(),
      //     r.cantidadComensales,
      //     r.estado,
      //     r.idCliente,
      //     []
      //   )
      // );
    
      // const client = new Client(
      //   reservation.Clientes.Usuarios.idUsuario as UUID,
      //   reservation.Clientes.Usuarios.nombreUsuario,
      //   reservation.Clientes.Usuarios.email,
      //   reservation.Clientes.Usuarios.contrasenia,
      //   reservation.Clientes.Usuarios.tipoUsuario,
      //   reservation.Clientes.nombre,
      //   reservation.Clientes.apellido,
      //   reservation.Clientes.telefono,
      //   reservation.Clientes.fechaNacimiento,
      //   reservation.Clientes.EstadosCliente.map(
      //     estado => new ClientState(estado.fechaActualizacion, estado.estado)
      //   ),
      //   reservasCliente
      // );
    
      // const mesas = reservation.Mesas_Reservas.map(mr => mr.Mesa);
    
      return new Reservation(
        reservation.idReserva,
        reservation.fechaReserva,
        reservation.horarioReserva.toISOString().slice(11, 16),
        reservation.fechaCancelacion ?? null,
        reservation.cantidadComensales,
        reservation.estado,
        reservation.idCliente,
        // mesas
      );
    }
}

