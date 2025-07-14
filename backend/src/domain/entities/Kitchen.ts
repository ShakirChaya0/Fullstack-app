import { UUID } from 'crypto';
import { TipoUsuario_Type } from "@prisma/client";
import { User } from './User.js';

export class Kitchen extends User {
    constructor(
        _userId: UUID,
        _userName: string,
        _email: string,
        _password: string,
        _userType: TipoUsuario_Type
    ) {
        super(_userId, _userName, _email , _password, _userType);
    }
}