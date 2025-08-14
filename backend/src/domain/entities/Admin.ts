import { UUID } from "crypto";
import { User } from "./User.js";
import { UserType } from "../../shared/types/SharedTypes.js";

export class Admin extends User {
    constructor(
        _userId: UUID,
        _userName: string,
        _email: string,
        _password: string,
        _userType: UserType,
        private _name: string,
        private _lastname: string,
        private _dni: string,
        private _phone: string
    ){ 
        super(_userId, _userName, _email, _password, _userType)
    }

    get name(): string { return this._name }
    get lastname(): string { return this._lastname }
    get dni(): string { return this._dni }
    get phone(): string { return this._phone }

    set name(name: string) { this._name = name }
    set lastname(lastname: string) { this._lastname = lastname }
    set dni(dni: string) { this._dni = dni }
    set phone(phone: string) { this._phone = phone }
}