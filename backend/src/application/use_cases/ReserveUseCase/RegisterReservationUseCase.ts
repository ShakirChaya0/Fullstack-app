import { ReservationRepository } from '../../../infrastructure/database/repository/ReservationRepository.js';
import { ClientRepository } from '../../../infrastructure/database/repository/ClientRepository.js';
import { TableRepository } from '../../../infrastructure/database/repository/TableRepository.js';
import { SchemaReservation } from '../../../shared/validators/reservationZod.js';
import { Reservation } from '../../../domain/entities/Reservation.js';
import { BusinessError } from '../../../shared/exceptions/BusinessError.js';

export class RegisterReservation {
  constructor(
    private readonly reservationRepository = new ReservationRepository(),
    private readonly clientRepository = new ClientRepository(),
    private readonly tableRepository = new TableRepository()
  ) {} 

  async execute(data: SchemaReservation): Promise<Reservation> {
    
    const client = await this.clientRepository.getClientByidUser(data.clientId);
    if (!client) {
      throw new Error('Client not found');
    }

    const unavailableTables = await this.tableRepository.checkAvailability(data.tableIds, data.reservationDate, data.reservationTime);
    if (unavailableTables.length > 0) {
      throw new BusinessError(`Mesas no disponibles: ${unavailableTables.join(', ')}`);
    } 
 
    
}
}