import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository.js";
import { PrismaClient } from "@prisma/client";
import { UUID } from "crypto";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";

const prisma = new PrismaClient();


export class RefreshTokenRepository implements IRefreshTokenRepository {
    async saveRefreshedToken(userId: string, refreshToken: string, endDate: Date): Promise<void> {
        try{
            await prisma.refreshTokens.create({
                data: {
                    idToken: crypto.randomUUID() as  UUID,
                    idUsuario: userId as UUID,
                    token: refreshToken,
                    fechaCreacion: new Date(), 
                    fechaExpiracion: endDate
                }
            });
        }catch (error: any) { 
            if (error.code === 'P2002' && error.meta?.target?.includes('token')) {
                throw new ConflictError("El token de refresco ya existe para este usuario");
            }
            else{
                throw new ServiceError("Error al guardar el token de refresco");
            }
        }
    }

    async revokeToken(token: string): Promise<void> {
        await prisma.refreshTokens.update({
            where: { token: token },
            data: { revocado: true }
        });
    }
}