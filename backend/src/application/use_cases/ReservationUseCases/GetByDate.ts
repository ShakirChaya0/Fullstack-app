import { ReservationRepository } from "../../../infrastructure/database/repository/ReservationRepository.js";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetByDate{
  constructor(
    private readonly reservationRepository = new ReservationRepository(),
  ) {}
  async execute(date: Date): Promise<Reservation[]> {
    const reservations = await this.reservationRepository.getByDate(date);
        if (reservations.length === 0) {
            throw new NotFoundError(`No se encontraron reservas para la fecha ${date}.`);
        }
    return reservations;
  }
}