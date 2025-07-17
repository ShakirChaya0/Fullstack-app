import { ReservationRepository } from "../../../infrastructure/database/repository/ReservationRepository.js";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetByCompleteName {
    constructor(
        private readonly reservationRepository = new ReservationRepository(),
    ){}

    async execute(name: string, lastName: string): Promise<Reservation[]> {
        const reservations = await this.reservationRepository.getByClientCompleteName(name, lastName);
        if (reservations.length === 0) {
            throw new NotFoundError(`No se encontraron reservas para el cliente ${name} ${lastName}.`);
        }
        return reservations;
    }
}