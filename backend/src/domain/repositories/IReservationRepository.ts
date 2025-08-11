import { Reservation, StateReservation } from '../entities/Reservation.js';
import { SchemaReservation } from '../../shared/validators/ReservationZod.js';
import { Table } from '../entities/Table.js';

export interface IReservationRepository {
  getExistingReservation(clientId: string, reservation: SchemaReservation): Promise<Reservation | null>;
  create(reservation: SchemaReservation, clientId: string, tables: Table[]): Promise<Reservation | null>; 
  getById(id: number): Promise<Reservation | null>;
  getByDate(date: Date): Promise<Reservation[]>;
  getByClientId(clientId: string): Promise<Reservation[]>;
  getReservationByNameAndLastnameClient(name: string, lastname:string): Promise<Reservation[]>;
  updateStatus(id: number, status: StateReservation): Promise<Reservation>;
}
