// import { Table } from '../../../domain/entities/Table.js';
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

  // private assignTables(mesasDisponibles: Table[], cantidadComensales: number): Table[] | null {
  //   const mesasOrdenadas = mesasDisponibles.sort((a, b) => b.capacidad - a.capacidad);
  //   const mesasAsignadas: Table[] = [];
  //   let capacidadAcumulada = 0;

  //   for (const mesa of mesasOrdenadas) {
  //     mesasAsignadas.push(mesa);
  //     capacidadAcumulada += mesa.capacidad;
  //     if (capacidadAcumulada >= cantidadComensales) {
  //       return mesasAsignadas;
  //     }
  //   }
  //   return null;
  // }

  public async execute(data: SchemaReservation, clientId: string): Promise<Reservation | null> {
    const client = await this.clientRepository.getClientByidUser(clientId);
    if (!client) {
      throw new NotFoundError('Cliente no encontrado');
    }

    if (data.cantidadComensales <= 0) {
      throw new BusinessError('El número de comensales debe ser mayor a 0');
    }

    const availableTables = await this.tableRepository.getTableByCapacity(data.cantidadComensales);

    if(!availableTables) {
      throw new BusinessError('No hay mesas disponibles para la cantidad de comensales');
    }

    const existingReservation = await this.reservationRepository.getExistingReservation(clientId,data); 

    if(existingReservation) {
      throw new BusinessError('Usted ya tiene una reserva para esa fecha y ese horario');
    }


    const newReservation = await this.reservationRepository.create(data,clientId,availableTables);
    return newReservation;
  }
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
