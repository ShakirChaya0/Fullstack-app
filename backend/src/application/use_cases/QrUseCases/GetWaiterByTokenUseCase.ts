import { QRTokenRepository } from "../../../infrastructure/database/repository/QRTokenRepository.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";


export class GetWaiterByToken {
    constructor(
        private readonly qrTokenRepository = new QRTokenRepository()
    ){}

    public async execute(token: string): Promise<string> {
        const qrData = await this.qrTokenRepository.getQRDataByToken(token)

        if(!qrData) throw new NotFoundError('No se encontro el registro para ese token');

        return qrData.idMozo
    }
}