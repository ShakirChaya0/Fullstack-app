import { PrismaClient,Prisma } from "@prisma/client";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { SchemaReservation } from "../../../shared/validators/Fix_reservationZod.js";
import { StateReservation } from "../../../domain/entities/Reservation.js";
import { Table } from "../../../domain/entities/Table.js";
import { ClientPublicInfo } from "../../../domain/repositories/IClientPublicInfo.js";
import { IReservationRepository } from "../../../domain/repositories/IReservationRepository.js";


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


export class ReservationRepository implements IReservationRepository  {
  
  public async getExistingReservation(clientId: string, reservation: SchemaReservation): Promise<Reservation | null> {
    
    const [hours, minutes] = reservation.horarioReserva.split(':').map(Number);

    const timeAsDate = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));

    const existingReservation = await prisma.reserva.findFirst({
        where: {
          idCliente: clientId, 
          fechaReserva : reservation.fechaReserva, 
          horarioReserva: timeAsDate
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

      if(existingReservation) {
        return this.toDomainEntity(existingReservation)
      }
      return null
  }

  public async create(reservation: SchemaReservation, clientId: string, tables: Table[]): Promise<Reservation | null> {

  const [hours, minutes] = reservation.horarioReserva.split(':').map(Number);
  const timeAsDate = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0));

    const createdReservation = await prisma.reserva.create({
      data: {
            fechaReserva: reservation.fechaReserva,
            horarioReserva: timeAsDate,
            fechaCancelacion: reservation.fechaCancelacion,
            cantidadComensales: reservation.cantidadComensales, 
            estado: "Realizada", 
            Clientes: { connect: { idCliente: clientId } }
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
        await prisma.mesas_Reservas.createMany({
          data: tables.map(table => ({
            idReserva : createdReservation.idReserva, 
            nroMesa: table.tableNum
          }))
        })
        const updatedReservation = await prisma.reserva.findUnique({
          where: { idReserva: createdReservation.idReserva },
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
                    Mesa: true,
                  },
                },
              },
          });
          if(!updatedReservation){
            return null;
          }
      return this.toDomainEntity(updatedReservation);
  }

  public async getById(id: number): Promise<Reservation | null> {
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

  public async getByDate(date: Date): Promise<Reservation[]> {
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

  public async updateStatus(id: number, status: StateReservation): Promise<Reservation> {
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
  
  public async getByClientId(clientId: string): Promise<Reservation[]> {
    const reservations = await prisma.reserva.findMany({
        where: { idCliente: clientId },
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

  public async getReservationByNameAndLastnameClient(name: string, lastname:string): Promise<Reservation[]> {
    const reservations = await prisma.reserva.findMany({
            where: {
              fechaReserva: new Date(),
              Clientes: {
                  nombre: name,
                  apellido: lastname
                }
            },
            include: {
                Clientes: {
                  include: {
                    Usuarios: true,
                    EstadosCliente: true,
                    Reserva: true
                  }
                },
              Mesas_Reservas: {
                include: {
                    Mesa: true
                  }
                }
            }
        });
    return reservations.map((reservation) => this.toDomainEntity(reservation));
  }

  private toDomainEntity(reservation: ReservationWithClient): Reservation {
    const tables: Table[] = reservation.Mesas_Reservas.map((mr) => {
      const table = mr.Mesa;
      return new Table(table.nroMesa, table.capacidad, table.estado); 
    });

    const clientPublicInfo: ClientPublicInfo = {
      nombre: reservation.Clientes.nombre, 
      apellido: reservation.Clientes.apellido, 
      telefono: reservation.Clientes.telefono
    }

    return new Reservation(
      reservation.idReserva,
      reservation.fechaReserva,
      reservation.horarioReserva.toISOString().slice(11, 16),
      reservation.fechaCancelacion ?? null,
      reservation.cantidadComensales,
      reservation.estado,
      clientPublicInfo,
      tables
    );
  }
}

