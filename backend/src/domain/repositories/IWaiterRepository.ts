import { SchemaWaiter } from '../../shared/validators/waiterZod.js';
import { Waiter } from '../entities/Waiter.js';


export interface IWaiterRepository {
    createWaiter(data: SchemaWaiter): Promise<Waiter>;
    deleteWaiter(idMozo: number): Promise<{ message: string }>;
    getAllWaiters(): Promise<Waiter[]>;
    getWaiterByUserName(userName: string): Promise<Waiter | null>;
    updateWaiter(idMozo: number, data: Partial<SchemaWaiter>): Promise<Waiter>;
    getWaiterById(idMozo: number): Promise<Waiter | null>;
}