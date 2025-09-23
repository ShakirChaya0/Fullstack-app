import { Reservation } from '../entities/Reservation.js';
import { SchemaReservation } from '../../shared/validators/ReservationZod.js';
import { Table } from '../entities/Table.js';
import { StateReservation } from '../../shared/types/SharedTypes.js';

export interface IReservationRepository {
  getExistingReservation(clientId: string, reservation: SchemaReservation): Promise<Reservation | null>;
  create(reservation: SchemaReservation, clientId: string, tables: Table[]): Promise<Reservation | null>; 
  getById(id: number): Promise<Reservation | null>;
  getByDate(date: Date): Promise<Reservation[]>;
  getByClientId(clientId: string, page: number, pageSize: number): Promise<{ data: Reservation[];
  meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }>;
  getReservationByNameAndLastnameClient(name: string, lastname:string): Promise<Reservation[]>;
  updateStatus(id: number, status: StateReservation): Promise<Reservation>;
}
