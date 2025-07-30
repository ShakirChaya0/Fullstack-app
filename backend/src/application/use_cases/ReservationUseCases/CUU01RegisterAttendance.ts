import { ReservationRepository } from "../../../infrastructure/database/repository/ReservationRepository.js";
import { Reservation } from "../../../domain/entities/Reservation.js";
import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class CUU01RegisterAttendance {
    constructor(
        private readonly reservationRepository = new ReservationRepository(), 
        private readonly clientRepository = new ClientRepository()
    ){}

    async execute(name: string , lastname: string) : Promise<Reservation[]>  {
        const client = await this.clientRepository.getClientByNameAndLastname(name, lastname)
        
        if(!client) {
            throw new NotFoundError('Cliente no encontrado');
        }
        
        const reservetionWithClient = await this.reservationRepository.getReservationByNameAndLastnameClient(client.name,client.lastname); 
        
        if(reservetionWithClient.length === 0) {
            throw new NotFoundError('No se ha encontrado ninguna reserva para ese cliente.'); 
        }

        return reservetionWithClient;
    }


}