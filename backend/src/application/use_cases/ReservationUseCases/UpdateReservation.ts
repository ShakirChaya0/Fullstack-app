import { ReservationRepository } from '../../../infrastructure/database/repository/ReservationRepository.js';
import { Reservation } from "../../../domain/entities/Reservation.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { PartialSchemaReservation } from '../../../shared/validators/reservationZod.js';



export class UpdateReservation {
    constructor(
    private readonly reservationRepository = new ReservationRepository(),
    ) {}
    public async execute(id: number, data: PartialSchemaReservation): Promise<Reservation | null> {
        const existingReservation = await this.reservationRepository.getById(id);
        if (!existingReservation) {
            throw new NotFoundError('Reserva no encontrada');
        }

        const updatedReservation = await this.reservationRepository.update(id, data);
        
        return updatedReservation;
    }
}