import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository.js";
import prisma from "../prisma/PrismaClientConnection.js"
import { UUID } from "crypto";
import { ConflictError } from "../../../shared/exceptions/ConflictError.js";
import { ServiceError } from "../../../shared/exceptions/ServiceError.js";
import { NotFoundError } from "../../../shared/exceptions/NotFoundError.js";
import { RefreshTokenInterface } from "../../../domain/interfaces/RefreshTokenInterface.js";

export class RefreshTokenRepository implements IRefreshTokenRepository {
    async saveRefreshedToken(userId: string, refreshToken: string, endDate: Date): Promise<void> {
        try {
            await prisma.refreshTokens.create({
                data: {
                    idToken: crypto.randomUUID() as  UUID,
                    idUsuario: userId as UUID,
                    token: refreshToken,
                    fechaCreacion: new Date(), 
                    fechaExpiracion: endDate
                }
            });
        } catch (error: any) { 
            if (error.code === 'P2002' && error.meta?.target?.includes('token')) {
                throw new ConflictError("El token de refresco ya existe para este usuario");
            }
            else {
                throw new ServiceError("Error al guardar el token de refresco");
            }
        }
    }

    async revokeToken(token: string): Promise<void> {
        try {
            await prisma.refreshTokens.update({
                where: { token: token },
                data: { revocado: true }
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new NotFoundError("Token no encontrado");
            }
            else {
                throw new ServiceError("Error al revocar el token de refresco");
            }
        }
    }

    async getRefreshToken(token: string): Promise<RefreshTokenInterface | null> {
        try {
            return await prisma.refreshTokens.findFirst({
                where: { token: token }
            })
        } catch (error) {
            throw new ServiceError("Error al recuperar el token de refresco");
        }
    }
}