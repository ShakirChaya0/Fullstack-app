import { ReservationRepository } from "../../../infrastructure/database/repository/ReservationRepository.js";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";


export class CUU01RegisterAttendance {
    constructor(
        private readonly reservationRepository = new ReservationRepository()
    ){}

    async execute(name: string , lastname: string) : Promise<Reservation[]>  {
        const reservatioClient = await this.reservationRepository.getReservationByNameAndLastnameClient(name, lastname)

        if(!reservatioClient) {
            throw new NotFoundError('El cliente no tiene ninguna reserva reliza para el dia de hoy');
        }


        const todayString = new Date().toISOString().split('T')[0];

        const reservationsToday = reservatioClient.filter(r => {
            const reserveDateString = new Date(r.reserveDate).toISOString().split('T')[0];
            return reserveDateString === todayString;
        });


        if(reservationsToday.length === 0) {
            throw new NotFoundError('No se ha encontrado ninguna reserva para ese cliente.'); 
        }

        return reservationsToday;
    }


}