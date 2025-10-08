import { ReservationRepository } from "../../../infrastructure/database/repository/ReservationRepository.js";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetByDate{
  constructor(
    private readonly reservationRepository = new ReservationRepository(),
  ) {}
  
  async execute(date: Date, page: number, pageSize: number): Promise<{ data: Reservation[]; meta: { page: number; pageSize: number; total: number; totalPages: number } }> {
    const {data, meta} = await this.reservationRepository.getByDate(date, page, pageSize);
    if (data.length === 0 && page === 1) throw new NotFoundError(`No se encontraron reservas para la fecha de ${date}.`);
        
    return {data, meta};
  }
}