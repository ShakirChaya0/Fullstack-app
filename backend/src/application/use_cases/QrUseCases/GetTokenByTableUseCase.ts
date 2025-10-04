import { QRTokenRepository } from "../../../infrastructure/database/repository/QRTokenRepository.js";
import { TableRepository } from "../../../infrastructure/database/repository/TableRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

export class GetTokenByTableUseCase {
    constructor(
        private readonly qrTokenRepository = new QRTokenRepository(),
        private readonly tableRepository = new TableRepository(),
    ){}

    public async execute(nroMesa: number): Promise<string> {
        const table = await this.tableRepository.getByNumTable(nroMesa);
        
        if(!table) throw new NotFoundError(`No se encontro la mesa solicitada`);
        
        const token = await this.qrTokenRepository.getQRByTableNumber(table.tableNum);

        if (!token) throw new NotFoundError("QR Token no encontrado");

        return token.tokenQR
    }
}