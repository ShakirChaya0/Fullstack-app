import { Reservation } from '../entities/Reservation.js';
import { SchemaReservation } from '../../shared/validators/reservationZod.js';
import { Table } from '../entities/Table.js';

export interface IReservationRepository {
  create(data: SchemaReservation, clientId: string, table: Table[] ): Promise<Reservation | null>;
  updateStatus(id: number, status: string): Promise<Reservation | null>;
  getById(id: number): Promise<Reservation | null>;
  getByDate(date: Date): Promise<Reservation[] | null>;
  getByClientId(clientId: string): Promise<Reservation[]>;
}
