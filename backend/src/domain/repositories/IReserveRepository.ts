import { Reserve } from "../../domain/entities/Reserve.js";
import { ReserveSchema } from "../../shared/validators/reserveZod.js";

export interface IReserveRepository {
    createReserve(reserve: ReserveSchema): Promise<Reserve>;
    getReserveById(id: string): Promise<Reserve | null>;
    updateReserve(id: string, reserve: ReserveSchema): Promise<Reserve | null>;
    deleteReserve(id: string): Promise<void>;
    listReserves(): Promise<Reserve[]>;
    }