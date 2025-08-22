import { Table } from '../../../domain/entities/Table.js';
import { ReservationRepository } from '../../../infrastructure/database/repository/ReservationRepository.js';
import { ClientRepository } from '../../../infrastructure/database/repository/ClientRepository.js';
import { TableRepository } from '../../../infrastructure/database/repository/TableRepository.js';
import { SchemaReservation } from '../../../shared/validators/ReservationZod.js';
import { Reservation } from '../../../domain/entities/Reservation.js';
import { BusinessError } from '../../../shared/exceptions/BusinessError.js';
import { NotFoundError } from '../../../shared/exceptions/NotFoundError.js';
import { PolicyRepository } from '../../../infrastructure/database/repository/PolicyRepository.js';
import { ScheduleRepositoy } from '../../../infrastructure/database/repository/ScheduleRepositoy.js';

export class RegisterReservation {
  constructor(
    private readonly reservationRepository = new ReservationRepository(),
    private readonly clientRepository = new ClientRepository(),
    private readonly tableRepository = new TableRepository(), 
    private readonly policyRepository = new PolicyRepository(), 
    private readonly schedulelRepository = new ScheduleRepositoy()
  ) {}

  private assignTables(availableTables: Table[], amountDiner: number): Table[] | null {
    const mesasAsignadas: Table[] = [];
    let capacidadAcumulada = 0;

    //Para buscar mesa de igual capacidad
    const table = availableTables.find(table => table.capacity >= amountDiner)

    if (table) {
      mesasAsignadas.push(table)
      return mesasAsignadas
    }  

    //Para juntar mesa
    for (const mesa of availableTables) {
      capacidadAcumulada += mesa.capacity;
      mesasAsignadas.push(mesa);

      if (capacidadAcumulada >= amountDiner) {
        return mesasAsignadas;
      }
    }

    return null;
  }

  private combineDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(":").map(Number);
    
    return new Date(Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      hours,
      minutes,
      0
    ));
  }

  public async execute(data: SchemaReservation, clientId: string): Promise<Reservation | null> {
    const policy = await this.policyRepository.getPolicy();
    const now = new Date();
    const reservaDateTime = this.combineDateTime(data.fechaReserva, data.horarioReserva);
    const diffMs = reservaDateTime.getTime() - (now.getTime() - 1000 * 60 * 60 * 3);

    if (diffMs < (policy.horasDeAnticipacionParaReservar * 60 * 60 * 1000)) throw new BusinessError(`Las reservas deben realizarse con al menos ${policy.horasDeAnticipacionParaReservar} horas de anticipación.`);

    const client = await this.clientRepository.getClientByidUser(clientId);
    if (!client) throw new NotFoundError('Cliente no encontrado');
    
    //Se busca el último estado que se le puso al cliente ordenadas por las fechas
    const latestState = client.states.sort((a, b) => new Date(b.modifyDate).getTime() - new Date(a.modifyDate).getTime())[0];
    const currentState = latestState.state === 'Habilitado';

    if (!currentState) throw new BusinessError('Usted no está habilitado para hacer una reserva');

    const existingReservation = await this.reservationRepository.getExistingReservation(clientId, data);
    
    if (existingReservation) throw new BusinessError('Usted ya tiene una reserva para esa fecha y ese horario');

    // Se valida que el horario de la Reserva sea entre los Horarios del Restaurante
    const dayReservation = data.fechaReserva.getDay();

    const schedule = await this.schedulelRepository.getById(dayReservation); 

    if (!schedule) throw new NotFoundError('No hay horarios disponibles para ese dia'); 

    const [hours, minutes] = data.horarioReserva.split(':').map(Number);
    const timeAsDate = new Date(Date.UTC(1970, 0, 1, hours, minutes, 0, 0));

    const [aperturaHours, aperturaMinutes] = schedule.horaApertura.split(':').map(Number);
    const [cierreHours, cierreMinutes] = schedule.horaCierre.split(':').map(Number);

    const aperturaDate = new Date(Date.UTC(1970, 0, 1, aperturaHours, aperturaMinutes, 0, 0));
    const cierreDate = new Date(Date.UTC(1970, 0, 1, cierreHours, cierreMinutes, 0, 0));

    if (timeAsDate < aperturaDate || timeAsDate > cierreDate) throw new BusinessError('Horario fuera del rango de atención');
    
    //Validacion de Mesas disponibles y su asignacion
    const mesasDisponibles = await this.tableRepository.getAvailableTables(data.fechaReserva, data.horarioReserva);
    
    if (mesasDisponibles.length === 0) throw new BusinessError('No hay mesas disponibles para esta fecha y hora');
    
    const mesasAsignadas = this.assignTables(mesasDisponibles, data.cantidadComensales);

    if (!mesasAsignadas) throw new BusinessError('No hay suficiente capacidad en las mesas disponibles para cubrir a todos los comensales');
  
    const newReservation = await this.reservationRepository.create(data, clientId, mesasAsignadas);
    return newReservation;
  }
}