import { PolicyRepository } from "../../../infrastructure/database/repository/Fix_policyRepository.js";
import { ReservationRepository } from "../../../infrastructure/database/repository/ReservationRepository.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { ClientRepository } from "../../../infrastructure/database/repository/ClientRepository.js";
import { ClientStateRepository } from "../../../infrastructure/database/repository/ClientStateRepository.js";

export class CheckExpiredReservations{
    constructor(
        private readonly policyRepoitory = new PolicyRepository(), 
        private readonly reservationRepository = new ReservationRepository(), 
        private readonly tableRepository = new TableRepository(),
        private readonly clientRepository = new ClientRepository(), 
        private readonly clientStateRepository = new ClientStateRepository()
    ){}

    private combineDateTime(date: Date, time: string): Date {
        const dateStr = date.toISOString().split("T")[0]; 
        return new Date(`${dateStr}T${time}`);
    }

    public async execute():Promise<void> {
        const policy = await this.policyRepoitory.getPolicy(); 
        const now = new Date();
        const reservations = await this.reservationRepository.getByDate(now); 

        for(const reservation  of reservations) {
            if(reservation.status === 'Realizada') {
                const reservationDate = this.combineDateTime(reservation.reserveDate, reservation.reserveTime);
                const expiration = new Date(reservationDate.getTime() + policy.minutosTolerancia * 60000);

                if (now > expiration) {
                    await this.reservationRepository.updateStatus(reservation.reserveId, 'No_Asistida');

                    await this.tableRepository.updateTableFree(reservation.table);

                    const client = await this.clientRepository.getClientByOtherDatas(reservation.toPublicInfo); 
                    
                    if(!client) {
                        throw new NotFoundError("Cliente no encontrado");
                    }
                        
                    const nonAttendance = client.reservation.filter(r => {r.status === 'No_Asistida'}).length; 
                        
                    const disabled = client.states.filter(s => {s.state === 'Deshabilitado'}).length
                        
                    const disabledWaiting = Math.floor(nonAttendance / policy.limiteDeNoAsistencias);
                        
                    if(disabled < disabledWaiting) {
                    await this.clientStateRepository.create(client.userId, 'Deshabilitado'); 
                        }
                    }
                }
            }
        }
    }