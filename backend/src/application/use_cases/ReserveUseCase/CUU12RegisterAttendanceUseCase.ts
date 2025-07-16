import { Reservation } from "../../../domain/entities/Reservation.js";
import { ReserveRepository } from "../../../infrastructure/database/repository/ReserveRepository.js";

export class CUU12RegisterAttendance {
    constructor(
        private readonly reserveRepository = new ReserveRepository
    ){}

    public async execute(now: string) : Promise <Reservation[] | null> {
        return await this.reserveRepository.getReservesToday(now);
    }
}