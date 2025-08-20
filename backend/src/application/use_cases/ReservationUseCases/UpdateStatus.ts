import { ReservationRepository } from '../../../infrastructure/database/repository/ReservationRepository.js';
import { TableRepository } from '../../../infrastructure/database/repository/TableRepository.js';
import { ClientRepository } from '../../../infrastructure/database/repository/ClientRepository.js';
import { BusinessError } from '../../../shared/exceptions/BusinessError.js';
import { NotFoundError } from '../../../shared/exceptions/NotFoundError.js';
import { ClientStateRepository } from '../../../infrastructure/database/repository/ClientStateRepository.js';
import { PolicyRepository } from '../../../infrastructure/database/repository/PolicyRepository.js';
import { StateReservation } from '../../../shared/types/SharedTypes.js';
import { Reservation } from '../../../domain/entities/Reservation.js';
import { Policy } from '../../../domain/entities/Policy.js';

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

  private async validateNonAttendaces(reservation: Reservation, policy: Policy) {
    const client = await this.clientRepository.getClientByOtherDatas(reservation.toPublicInfo); 

    if (!client) throw new NotFoundError("Cliente no encontrado");

    const nonAttendance = client.reservation.filter(r => r.status === 'No_Asistida').length; 

    const disabled = client.states.filter(s => s.state === 'Deshabilitado').length

    const disabledWaiting = Math.floor(nonAttendance / policy.limiteDeNoAsistencias);

    if (disabled < disabledWaiting) await this.clientStateRepository.create(client.userId, 'Deshabilitado'); 
  }

  public async execute(reservationId: number, status: StateReservation): Promise<void> {
    const policy = await this.policyRepository.getPolicy();
    const reservation = await this.reservationRepository.getById(reservationId);
    if (!reservation) throw new BusinessError('Reserva no encontrada');
    if (reservation.status === 'Cancelada') throw new BusinessError('No es posible realizar esta acción: la reserva ya se encuentra cancelada.');
    if (reservation.status === 'Asistida') throw new BusinessError('La reserva ya fue asistida, por lo que no es posible modificar su estado.');
    if (reservation.status === 'No_Asistida') throw new BusinessError('No se puede cambiar el estado de una reserva marcada como No Asistida.');

    if (status === 'Cancelada') {
      const now = new Date(); 
      const reservationDateTime = this.combineDateTime(reservation.reserveDate, reservation.reserveTime); 

      const differenceMs = reservationDateTime.getTime() - now.getTime();
      const differenceHours = differenceMs / (1000 * 60 * 60);

      if (differenceHours < policy.horasDeAnticipacionParaCancelar) {
        await this.reservationRepository.updateStatus(reservation.reserveId, "No_Asistida");
        await this.validateNonAttendaces(reservation, policy);
        return
      }
      
      await this.reservationRepository.updateStatus(reservation.reserveId, status);
      return;
    }

    const updatedReservation = await this.reservationRepository.updateStatus(reservation.reserveId, status);

    if (updatedReservation.status === 'Asistida') await this.tableRepository.updateTableBusy(updatedReservation.table)
    
    if (updatedReservation.status === 'No_Asistida') {
      await this.validateNonAttendaces(reservation, policy);
    }
  }   
} 
