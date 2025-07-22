import { ReservationRepository } from '../../../infrastructure/database/repository/ReservationRepository.js';
import { Reservation } from '../../../domain/entities/Reservation.js';
import { BusinessError } from '../../../shared/exceptions/BusinessError.js';
import { EstadoReserva } from '../../../domain/entities/Reservation.js';


export class UpdateStatus {
  constructor(
    private readonly reservationRepository = new ReservationRepository(),
  ) {}

  public async execute(reservationId: number, status: EstadoReserva): Promise<Reservation> {
    const reservation = await this.reservationRepository.getById(reservationId);
    if (!reservation) {
      throw new BusinessError('Reserva no encontrada');
    }

    if (reservation.status === 'Cancelada') {
      throw new BusinessError('No es posible realizar esta acción: la reserva ya se encuentra cancelada.');
    }
    if (reservation.status === 'Asistida') {
      throw new BusinessError('La reserva ya fue asistida, por lo que no es posible modificar su estado.');
    }
    if (reservation.status === 'No_Asistida') {
      throw new BusinessError('No se puede cambiar el estado de una reserva marcada como No Asistida.');
    }

    const updatedReservation = await this.reservationRepository.updateStatus(reservation.reserveId, status);
    
    return updatedReservation;
  }
}