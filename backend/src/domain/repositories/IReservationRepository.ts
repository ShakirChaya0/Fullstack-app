import { Reservation } from '../entities/Reservation.js';
import { SchemaReservation, PartialSchemaReservation } from '../../shared/validators/reservationZod.js';

export interface IReservationRepository {
  create(data: SchemaReservation, clientId: string): Promise<Reservation>;
  update(id: number, data: PartialSchemaReservation): Promise<Reservation | null>;
  updateStatus(id: number, status: string): Promise<Reservation | null>;
  getById(id: number): Promise<Reservation | null>;
  getByClientCompleteName(name: string, apellido: string): Promise<Reservation[]>;
  getByDate(date: Date): Promise<Reservation[] | null>;
  getByClientId(clientId: string): Promise<Reservation[]>;
}
