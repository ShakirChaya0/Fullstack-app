import { IQRTokenRepository } from "../../../domain/repositories/IQRTokenRepository.js";
import { PrismaClient } from "@prisma/client";
import { QRTokenInterface } from "../../../domain/interfaces/Fix_qRToken.interface.js";

const prisma = new PrismaClient()

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