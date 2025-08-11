import { Table } from '../../../domain/entities/Table.js';
import { ReservationRepository } from '../../../infrastructure/database/repository/ReservationRepository.js';
import { ClientRepository } from '../../../infrastructure/database/repository/ClientRepository.js';
import { TableRepository } from '../../../infrastructure/database/repository/TableRepository.js';
import { SchemaReservation } from '../../../shared/validators/ReservationZod.js';
import { Reservation } from '../../../domain/entities/Reservation.js';
import { BusinessError } from '../../../shared/exceptions/BusinessError.js';
import { NotFoundError } from '../../../shared/exceptions/NotFoundError.js';
import { PolicyRepository } from '../../../infrastructure/database/repository/PolicyRepository.js';

export class RegisterReservation {
  constructor(
    private readonly reservationRepository = new ReservationRepository(),
    private readonly clientRepository = new ClientRepository(),
    private readonly tableRepository = new TableRepository(), 
    private readonly policyRepository = new PolicyRepository()
  ) {}

  private assignTables(availableTables: Table[], amountDiner: number): Table[] | null {
    const mesasAsignadas: Table[] = [];
    let capacidadAcumulada = 0;

    for (const mesa of availableTables) {
      mesasAsignadas.push(mesa);
      capacidadAcumulada += mesa.capacity;
      if (capacidadAcumulada >= amountDiner) {
        return mesasAsignadas;
      }
    }
    return null;
  }

  private combineDateTime(date: Date, time: string): Date {
      const [hours, minutes] = time.split(":").map(Number);
      
      return new Date(Date.UTC(
          date.getUTCFullYear(),
          date.getUTCMonth(),
          date.getUTCDate(),
          hours,
          minutes,
          0
      ));
  }

  public async execute(data: SchemaReservation, clientId: string): Promise<Reservation | null> {
    const policy = await this.policyRepository.getPolicy();
    const now = new Date();
    const reservaDateTime = this.combineDateTime(data.fechaReserva, data.horarioReserva);
    const diffMs = reservaDateTime.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < policy.horasDeAnticipacionParaReservar) {
      throw new BusinessError(`Las reservas deben realizarse con al menos ${policy.horasDeAnticipacionParaReservar} horas de anticipación.`);
    }

      const client = await this.clientRepository.getClientByidUser(clientId);
      if (!client) {
        throw new NotFoundError('Cliente no encontrado');
      }

      //Se busaca el ultimo esatdo que se le puso al cliente ordenadas por las fechas
      const latestState = client.states
      .sort((a, b) => new Date(b.modifyDate).getTime() - new Date(a.modifyDate).getTime())[0];

      const currentState = latestState.state === 'Habilitado';

    if (!currentState) {
  throw new BusinessError('Usted no está habilitado para hacer una reserva');
    }

      const mesasDisponibles = await this.tableRepository.getAvailableTables(data.fechaReserva, data.horarioReserva);

      
      const existingReservation = await this.reservationRepository.getExistingReservation(clientId, data);
      
      if (existingReservation) {
        throw new BusinessError('Usted ya tiene una reserva para esa fecha y ese horario');
      }
      
      if (mesasDisponibles.length === 0) {
        throw new BusinessError('No hay mesas disponibles para esta fecha y hora');
      }

      const mesasAsignadas = this.assignTables(mesasDisponibles, data.cantidadComensales);

      if (!mesasAsignadas) {
      throw new BusinessError('No hay suficiente capacidad en las mesas disponibles para cubrir a todos los comensales');
      }


      const newReservation = await this.reservationRepository.create(data, clientId, mesasAsignadas);

      return newReservation;
  }

}