import { UUID } from "crypto";
import { User } from "./User.js";
import { TipoUsuario_Type } from "@prisma/client";

export class Client extends User {
    constructor(
        _userId: UUID,
        _userName: string,
        _email: string,
        _password: string,
        _userType: TipoUsuario_Type,
        private _name: string,
        private _lastName: string,
        private _dni: number,
        private _phone: string,
    ) { 
        super(_userId, _userName, _email , _password, _userType);
    }

    get name(): string {
        return this._name;
    }
    get lastname(): string {
        return this._lastName;
    }
    get dni(): number {
        return this._dni;
    }
    get phone(): string {
        return this._phone;
    }


    set nombreUsuario(nombreUsuario: string) {
        this._userName = nombreUsuario;
    }
    set contrasenia(contrasenia: string) {
        this._password = contrasenia;
    }
    set nombre(nombre: string) {
        this._name = nombre;
    }
    set apellido(apellido: string) {
        this._lastName = apellido;
    }
    set dni(dni: number) {
        this._dni = dni;
    }
    set telefono(telefono: string) {
        this._phone = telefono;
    }
    set email(email: string) {
        this._email = email;
    }
}