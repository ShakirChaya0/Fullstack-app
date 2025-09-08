import { SchemaWaiter } from '../../shared/validators/WaiterZod.js';
import { Waiter } from '../entities/Waiter.js';

export interface IWaiterRepository {
    createWaiter(data: SchemaWaiter): Promise<Waiter>;
    updateWaiter(idMozo: string, data: Partial<SchemaWaiter>, nombreUsuario: string): Promise<Waiter>;
    deleteWaiter(idMozo: string): Promise<void>;
    getAllWaiters(page: number): Promise<{Waiters: Waiter[], totalItems: number, pages: number}>;
    getWaiterByUserName(userName: string, page: number): Promise<{Waiters: Waiter[], totalItems: number, pages: number}>;
    getWaiterById(idMozo: string): Promise<Waiter | null>;
}