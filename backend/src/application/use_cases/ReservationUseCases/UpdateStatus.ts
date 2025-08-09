import { ReservationRepository } from '../../../infrastructure/database/repository/ReservationRepository.js';
import { TableRepository } from '../../../infrastructure/database/repository/TableRepository.js';
import { ClientRepository } from '../../../infrastructure/database/repository/ClientRepository.js';
import { BusinessError } from '../../../shared/exceptions/BusinessError.js';
import { StateReservation } from '../../../domain/entities/Reservation.js';
import { NotFoundError } from '../../../shared/exceptions/NotFoundError.js';
import { ClientStateRepository } from '../../../infrastructure/database/repository/ClientStateRepository.js';
import { PolicyRepository } from '../../../infrastructure/database/repository/PolicyRepository.js';

export class UpdateStatus {
  constructor(
    private readonly reservationRepository = new ReservationRepository(),
    private readonly tableRepository = new TableRepository(), 
    private readonly clientRepository = new ClientRepository(), 
    private readonly clientStateRepository = new ClientStateRepository(), 
    private readonly policyRepository = new PolicyRepository()
  ) {}

    private combineDateTime(date: Date, time: string): Date {
        const dateStr = date.toISOString().split("T")[0]; 
        return new Date(`${dateStr}T${time}`);
    }

  public async execute(reservationId: number, status: StateReservation) {
    const policy = await this.policyRepository.getPolicy();
    const reservation = await this.reservationRepository.getById(reservationId);
    if (!reservation) {
      throw new BusinessError('Reserva no encontrada');
    }

    if (reservation.status === 'Cancelada') {
      throw new BusinessError('No es posible realizar esta acción: la reserva ya se encuentra cancelada.');
    }
    if (reservation.status === 'Asistida') {
      throw new BusinessError('La reserva ya fue asistida, por lo que no es posible modificar su estado.');
    }
    if (reservation.status === 'No_Asistida') {
      throw new BusinessError('No se puede cambiar el estado de una reserva marcada como No Asistida.');
    }

    if(status === 'Cancelada') {
      const now = new Date(); 
      const reservationDateTime = this.combineDateTime(reservation.reserveDate, reservation.reserveTime); 

      const differenceMs = reservationDateTime.getTime() - now.getTime();
      const differenceHours = differenceMs / (1000 * 60 * 60);

      if (differenceHours < policy.horasDeAnticipacionParaCancelar) {
        throw new BusinessError("No se puede cancelar con menos de 6 horas de anticipación.");
      }
      
      await this.reservationRepository.updateStatus(reservation.reserveId, status);
      await this.tableRepository.updateTableFree(reservation.table);
      return;
    }



    const updatedReservation = await this.reservationRepository.updateStatus(reservation.reserveId, status);



    if(updatedReservation.status === 'Asistida') {
      await this.tableRepository.updateTableBusy(updatedReservation.table)
    }
    
    if(updatedReservation.status === 'No_Asistida'){
      await this.tableRepository.updateTableFree(updatedReservation.table)
      const client = await this.clientRepository.getClientByOtherDatas(reservation.toPublicInfo); 

      console.log(client)

        if(!client) {
          throw new NotFoundError("Cliente no encontrado");
        }

      const nonAttendance = client.reservation.filter(r => r.status === 'No_Asistida').length; 

      console.log(nonAttendance);

      const disabled = client.states.filter(s => s.state === 'Deshabilitado').length

      console.log(disabled);

      const disabledWaiting = Math.floor(nonAttendance / policy.limiteDeNoAsistencias);

      console.log(disabledWaiting)

      if(disabled < disabledWaiting) {
        console.log()
        await this.clientStateRepository.create(client.userId, 'Deshabilitado'); 
      }
    }
  }   
} 
