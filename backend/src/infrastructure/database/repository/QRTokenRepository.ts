import { IQRTokenRepository } from "../../../domain/repositories/IQRTokenRepository.js";
import { PrismaClient } from "@prisma/client";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";

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
                    createdAt: new Date(),
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

    public async getWaiterByToken(tokenQR: string): Promise<string>{
        const waiter = await prisma.qRToken.findUnique({
            where: { tokenQR: tokenQR }
        })

        if (!waiter) {
            throw new NotFoundError("Mozo no encontrado");
        }

        return waiter.idMozo
    }
}