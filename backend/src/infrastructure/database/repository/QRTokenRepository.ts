import { IQRTokenRepository } from "../../../domain/repositories/IQRTokenRepository.js";
import prisma from "../prisma/PrismaClientConnection.js"
import { QRTokenInterface } from "../../../domain/interfaces/QRToken.interface.js";


export class QRTokenRepository implements IQRTokenRepository {

    public async createOrUpdate(nroMesa: number, idMozo: string, tokenQR: string): Promise<void>{
        const QRToken = await prisma.qRToken.findUnique({
            where: { nroMesa: nroMesa }
        })
        if(!QRToken){
            await prisma.qRToken.create({
                data: {
                    nroMesa: nroMesa,
                    idMozo: idMozo,
                    tokenQR: tokenQR,
                }
            })
        }   
        else {
            await prisma.qRToken.update({
                where: {nroMesa: nroMesa},
                data: {
                    idMozo: idMozo,
                    tokenQR: tokenQR,
                    fechaCreacion: new Date(),
                    revocado: false,
                }
            })
        } 
    }

    public async revoke(nroMesa: number): Promise<void> {
            await prisma.qRToken.update({
                where: {nroMesa: nroMesa},
                data: {
                    revocado: true,
                }
            })
    }

    public async getQRDataByToken(tokenQR: string): Promise< QRTokenInterface | null>{
        const registeredQRData = await prisma.qRToken.findUnique({
            where: { tokenQR: tokenQR }
        })

        return registeredQRData 

    }

    public async getQRByTableNumber(nroMesa: number): Promise<QRTokenInterface | null> {
        const qrToken = await prisma.qRToken.findUnique({
            where: { nroMesa: nroMesa}
        })

        return qrToken
    }
}