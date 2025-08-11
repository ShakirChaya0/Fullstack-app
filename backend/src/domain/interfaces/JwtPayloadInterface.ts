import { TipoUsuario_Type } from "@prisma/client";
import { UUID } from 'crypto';

export interface JwtPayloadInterface {
    idUsuario: UUID
    email: string
    tipoUsuario: TipoUsuario_Type
    username: string
}