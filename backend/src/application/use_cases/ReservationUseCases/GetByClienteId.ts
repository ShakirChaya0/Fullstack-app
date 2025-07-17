import { ReservationRepository } from "../../../infrastructure/database/repository/ReservationRepository.js";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";


export class GetByClientId {
    constructor(
        private readonly reservationRepository = new ReservationRepository(),
    ){}

    async execute(clientId: number): Promise<Reservation[]> {
        const reservations = await this.reservationRepository.getByClientId(clientId);
        if (reservations.length === 0) {
            throw new NotFoundError(`No se encontraron reservas para el cliente con ID ${clientId}.`);
        }
        return reservations;
    }
}