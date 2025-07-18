import { Mesa } from '@prisma/client';
import { ReservationRepository } from '../../../infrastructure/database/repository/ReservationRepository.js';
import { ClientRepository } from '../../../infrastructure/database/repository/ClientRepository.js';
import { TableRepository } from '../../../infrastructure/database/repository/TableRepository.js';
import { SchemaReservation } from '../../../shared/validators/reservationZod.js';
import { Reservation } from '../../../domain/entities/Reservation.js';
import { BusinessError } from '../../../shared/exceptions/BusinessError.js';
import { NotFoundError } from '../../../shared/exceptions/NotFoundError.js';

export class RegisterReservation {
  constructor(
    private readonly reservationRepository = new ReservationRepository(),
    private readonly clientRepository = new ClientRepository(),
    private readonly tableRepository = new TableRepository()
  ) {}

  private assignTables(mesasDisponibles: Mesa[], cantidadComensales: number): Mesa[] | null {
    const mesasOrdenadas = mesasDisponibles.sort((a, b) => b.capacidad - a.capacidad);
    const mesasAsignadas: Mesa[] = [];
    let capacidadAcumulada = 0;

    for (const mesa of mesasOrdenadas) {
      mesasAsignadas.push(mesa);
      capacidadAcumulada += mesa.capacidad;
      if (capacidadAcumulada >= cantidadComensales) {
        return mesasAsignadas;
      }
    }
    return null;
  }

  public async execute(data: SchemaReservation, clientId: string): Promise<Reservation> {
    const client = await this.clientRepository.getClientByidUser(clientId);
    if (!client) {
      throw new NotFoundError('Cliente no encontrado');
    }

    if (data.cantidadComensales <= 0) {
      throw new BusinessError('El número de comensales debe ser mayor a 0');
    }
    // const mesasDisponibles = await this.tableRepository.getAvailableTables(data.fechaReserva, data.horarioReserva);
    // if (mesasDisponibles.length === 0) {
    //   throw new BusinessError('No hay mesas disponibles para esta fecha y hora');
    // }

    // const mesasAsignadas = this.assignTables(mesasDisponibles, data.cantidadComensales);
    // if (!mesasAsignadas) {
    //   throw new BusinessError('No hay suficiente capacidad en las mesas disponibles para cubrir a todos los comensales');
    // }

    // Mapeamos sólo los campos necesarios para el create en Prisma (nroMesa)
    // const mesasParaGuardar = mesasAsignadas.map(({ capacidad, estado }) => ({ capacidad, estado }));

    const nuevaReserva = await this.reservationRepository.create({
      fechaReserva: data.fechaReserva,
      horarioReserva: data.horarioReserva,
      cantidadComensales: data.cantidadComensales,
      estado: data.estado,
      // table: mesasParaGuardar
    },
    clientId, 
  );

    return nuevaReserva;
  }
}
