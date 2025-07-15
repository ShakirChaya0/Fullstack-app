import { UUID } from 'crypto';
import { TipoUsuario_Type } from "@prisma/client";

export class User {
    constructor(
        protected readonly _userId: UUID,
        protected _userName: string,
        protected _email: string,
        protected _password: string,
        protected readonly _userType: TipoUsuario_Type
    ) {}

    get userId(): UUID { return this._userId }
    get userName(): string { return this._userName } 
    get email(): string { return this._email }
    get password(): string { return this._password }
    get userType(): string { return this._userType }

    // set userId(userId: UUID) { this._userId = userId }
    set userName(userName: string) { this._userName  = userName } 
    set email(email: string) { this._email = email }
    set password(pwd: string) { this._password = pwd }
    // set userType(type: TipoUsuario_Type) { this._userType = type }
}