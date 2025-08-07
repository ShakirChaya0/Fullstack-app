

export interface IQRTokenRepository {
    createOrUpdate(nroMesa: number, idMozo: string, tokenQR: string): Promise<void>;
    revoke(nroMesa: number): Promise<void>;
    getWaiterByToken(tokenQR: string): Promise<string>
}