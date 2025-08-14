import { UUID } from "crypto";
import { User } from "./User.js";
import { UserType } from '../../shared/types/SharedTypes.js';
import { WaiterPublicInfo } from "../interfaces/WaiterPublicInfo.js";

export class Waiter extends User {
    constructor(
        _userId: UUID,
        _userName: string,
        _email: string,
        _password: string,
        _userType: UserType,
        private _name: string,
        private _lastName: string,
        private _dni: string,
        private _phone: string,
    ) { 
        super(_userId, _userName, _email , _password, _userType);
    }

    get nombre(): string {
        return this._name;
    }

    get apellido(): string {
        return this._lastName;
    }

    get dni(): string {
        return this._dni;
    }

    get telefono(): string {
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

    set dni(dni: string) {
        this._dni = dni;
    }

    set telefono(telefono: string) {
        this._phone = telefono;
    }

    set email(email: string) {
        this._email = email;
    }

    public toPublicInfo(): WaiterPublicInfo {
        return { nombre: this._name, apellido: this._lastName, username: this._userName };
    }
}