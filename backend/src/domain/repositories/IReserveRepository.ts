import { Reservation } from "../entities/Reservation.js";
import { SchemaReserve } from "../../shared/validators/reserveZod.js";

export interface IReserveRepository {
    createReserve(reserve: SchemaReserve): Promise<Reservation>;
    getReserveById(id: string): Promise<Reservation | null>;
    getReservesByClientCompleteName(name: string, lastName: string): Promise<Reservation[]>;
    getReservesByDate(date : string): Promise<Reservation[] | null>;
    updateReserve(id: string, reserve: SchemaReserve): Promise<Reservation | null>;
    }