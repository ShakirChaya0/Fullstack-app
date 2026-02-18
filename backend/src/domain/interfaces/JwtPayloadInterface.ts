import { UUID } from 'crypto';
import { UserType } from '../../shared/types/SharedTypes.js';

export interface JwtPayloadInterface {
    idUsuario: UUID
    email: string
    tipoUsuario: UserType
    username: string
}