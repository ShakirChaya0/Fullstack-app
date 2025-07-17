import { ReservationRepository } from '../../../infrastructure/database/repository/ReservationRepository.js';
import { Reservation } from '../../../domain/entities/Reservation.js';
import { BusinessError } from '../../../shared/exceptions/BusinessError.js';


export class UpdateStatus {
  constructor(
    private readonly reservationRepository = new ReservationRepository(),
  ) {}

  public async execute(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.getById(reservationId);
    if (!reservation) {
      throw new BusinessError('Reserva no encontrada');
    }

    if (reservation.status === 'Cancelada') {
      throw new BusinessError('La reserva ya está cancelada');
    }
    if (reservation.status === 'Asistida') {
      throw new BusinessError('No se puede cancelar una reserva asistida');
    }

    const updatedReservation = await this.reservationRepository.updateStatus(reservation.reserveId, "Cancelada");
    
    return updatedReservation;
  }
}