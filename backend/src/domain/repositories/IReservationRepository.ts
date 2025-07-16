import { Reservation } from '../entities/Reservation.js';
import { SchemaReservation, PartialSchemaReservation } from '../../shared/validators/reservationZod.js';

export interface IReservationRepository {
  create(data: SchemaReservation, tableIds: number[]): Promise<Reservation>;
  update(id: number, data: PartialSchemaReservation): Promise<Reservation>;
  getById(id: number): Promise<Reservation | null>;
  getByClientName(name: string): Promise<Reservation[]>;
  getByDate(date: Date): Promise<Reservation[]>;
  getByClientId(clientId: number): Promise<Reservation[]>;
}
