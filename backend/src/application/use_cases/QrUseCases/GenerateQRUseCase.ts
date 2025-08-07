import { QRTokenRepository } from "../../../infrastructure/database/repository/QRTokenRepository.js";
import {randomUUID} from 'crypto'
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { WaiterRepository } from "../../../infrastructure/database/repository/WaiterRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class RegisterOrModifyQRUseCase {
    constructor(
        private readonly qrTokenRepository = new QRTokenRepository(),
        private readonly tableRepository = new TableRepository(),
        private readonly waiterRepository = new WaiterRepository()
    ){}

    public async execute(nroMesa: number, idMozo: string): Promise<string> {
        const waiter = await this.waiterRepository.getWaiterById(idMozo)

        if(!waiter) {
            throw new NotFoundError('No se encontro el mozo solicitado');
        }
        
        const table = await this.tableRepository.getByNumTable(nroMesa)
        
        if(!table) {
            throw new NotFoundError(`No se encontro la mesa solicitada`);
        }

        const token = randomUUID()

        await this.qrTokenRepository.createOrUpdate(nroMesa, idMozo, token)

        return token
    }
}