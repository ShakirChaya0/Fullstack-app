import prisma from "../prisma/PrismaClientConnection.js"
import { Usuarios } from "@prisma/client";
import { User } from "../../../domain/entities/User.js";
import { UUID } from "crypto";
import { IUserRepository } from "../../../domain/repositories/IUserRepository.js";

export class UserRepository implements IUserRepository{
    async findByEmail(email: string): Promise<User | null> {
        const user = await prisma.usuarios.findUnique({
            where: { email }
        });
        return user ? this.toDomainEntity(user) : null;
    }

    async findById(id: string): Promise<User | null> {
        const user = await prisma.usuarios.findUnique({
            where: { idUsuario: id }
        });
        return user ? this.toDomainEntity(user) : null;
    }

    private toDomainEntity(user: Usuarios): User {
        return new User(
            user.idUsuario as UUID,
            user.nombreUsuario,
            user.email,
            user.contrasenia,
            user.tipoUsuario
        );
    }
}