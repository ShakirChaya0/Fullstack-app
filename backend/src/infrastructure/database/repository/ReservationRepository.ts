import prisma from "../prisma/PrismaClientConnection.js"
import { Prisma } from "@prisma/client";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { SchemaReservation } from "../../../shared/validators/ReservationZod.js";
import { Table } from "../../../domain/entities/Table.js";
import { ClientPublicInfo } from "../../../domain/interfaces/ClientPublicInfo.js";
import { IReservationRepository } from "../../../domain/repositories/IReservationRepository.js";
import { StateReservation } from "../../../shared/types/SharedTypes.js";

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
  
  public async getExistingReservation(clientId: string, reservation: SchemaReservation): Promise<Reservation | null> {
    const [hours, minutes] = reservation.reserveTime.split(':').map(Number);

    const timeAsDate = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));

    const existingReservation = await prisma.reserva.findFirst({
      where: {
        idCliente: clientId, 
        fechaReserva : reservation.reserveDate, 
        horarioReserva: timeAsDate, 
        estado: "Realizada"
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

    if (existingReservation) return this.toDomainEntity(existingReservation);
    
    return null
  }

  public async create(reservation: SchemaReservation, clientId: string, tables: Table[]): Promise<Reservation | null> {
    const [hours, minutes] = reservation.reserveTime.split(':').map(Number);

    const timeAsDate = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));

    const createdReservation = await prisma.reserva.create({
      data: {
        fechaReserva: reservation.reserveDate,
        horarioReserva: timeAsDate,
        fechaCancelacion: reservation.cancelationDate,
        cantidadComensales: reservation.commensalsNumber, 
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

    if (!updatedReservation) return null;

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

  public async getByDate(date: Date, page?: number, pageSize?: number): Promise<{data: Reservation[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {

    const dateOnly = new Date(date);
    dateOnly.setUTCHours(0, 0, 0, 0);

    const startOfDay = dateOnly;

    const startOfNextDay = new Date(startOfDay);
    startOfNextDay.setUTCDate(startOfNextDay.getUTCDate() + 1);

    const dateRangeFilter = {
      fechaReserva: {
        gte: startOfDay,
        lt: startOfNextDay,
      },
    };

    const queryOptions: Prisma.ReservaFindManyArgs = {
      where: dateRangeFilter,
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
    };

    if (page && pageSize && page > 0 && pageSize > 0) {
      queryOptions.skip = (page > 0 ? page - 1 : 0) * pageSize;
      queryOptions.take = pageSize;
    }

     const reservations = await prisma.reserva.findMany({
          ...queryOptions
        }) as ReservationWithClient[];

    const total = await prisma.reserva.count({
      where: dateRangeFilter,
    });

    const effectivePage = page && page > 0 ? page : 1;
    const effectivePageSize = pageSize && pageSize > 0 ? pageSize : total;

    return {
      data: reservations.map((reservation) => this.toDomainEntity(reservation)),
      meta: {
        page: effectivePage,
        pageSize: effectivePageSize,
        total,
        totalPages: effectivePageSize > 0 ? Math.ceil(total / effectivePageSize) : 1,
      },
    };
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
    });

    return this.toDomainEntity(updatedReservation);
  }
  
  public async getByClientId(clientId: string, page: number, pageSize: number): Promise<{ data: Reservation[];
  meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }> {
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
      orderBy: {
        fechaReserva: 'desc'
      }, 
      skip: (page - 1) * pageSize, 
      take: pageSize
    });
    
    const total = await prisma.reserva.count({
      where: { idCliente: clientId },
    });

    return {
      data: reservations.map((reservation) => this.toDomainEntity(reservation)),
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
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

