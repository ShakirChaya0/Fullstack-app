import { ReservationRepository } from "../../../infrastructure/database/repository/ReservationRepository.js";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetById {
  constructor(
    private readonly reservationRepository = new ReservationRepository(),
  ) {}

  async execute(id: number): Promise<Reservation | null> {
    const reservation = await this.reservationRepository.getById(id);
    if (!reservation) throw new NotFoundError(`Reserva con ID ${id} no encontrada.`);
    
    return reservation;
  }
}