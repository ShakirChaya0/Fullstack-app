import { QRTokenInterface } from "../interfaces/QRToken.interface.js";


export interface IQRTokenRepository {
    createOrUpdate(nroMesa: number, idMozo: string, tokenQR: string): Promise<void>;
    revoke(nroMesa: number): Promise<void>;
    getQRDataByToken(tokenQR: string): Promise< QRTokenInterface | null>
    getQRByTableNumber(nroMesa: number): Promise<QRTokenInterface | null>
}