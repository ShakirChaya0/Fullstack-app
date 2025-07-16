import { Reserve } from "../../domain/entities/Reserve.js";
import { SchemaReserve } from "../../shared/validators/reserveZod.js";

export interface IReserveRepository {
    createReserve(reserve: SchemaReserve): Promise<Reserve>;
    getReserveById(id: string): Promise<Reserve | null>;
    getReservesByClientCompleteName(name: string, lastName: string): Promise<Reserve[]>;
    getReservesToday(): Promise<Reserve[]>;
    updateReserve(id: string, reserve: SchemaReserve): Promise<Reserve | null>;
    }