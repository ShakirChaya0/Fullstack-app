import { QRTokenInterface } from "../interfaces/Fix_qRToken.interface.js";


export interface IQRTokenRepository {
    createOrUpdate(nroMesa: number, idMozo: string, tokenQR: string): Promise<void>;
    revoke(nroMesa: number): Promise<void>;
    getQRDataByToken(tokenQR: string): Promise< QRTokenInterface | null>
}