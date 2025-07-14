import { UUID } from "crypto";
import { ValidateWaiter, ValidateWaiterPartial } from "../../shared/validators/waiterZod.js";
import { User } from "./User.js";
import { TipoUsuario_Type } from "@prisma/client";

export class Waiter extends User {
    constructor(
        _userId: UUID,
        _userName: string,
        _email: string,
        _password: string,
        _userType: TipoUsuario_Type,
        private _name: string,
        private _lastName: string,
        private _dni: string,
        private _phone: string,
    ) { 
        super(_userId, _userName, _email , _password, _userType);
        //ValidateWaiter(this);
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
        ValidateWaiterPartial({ nombreUsuario});
        this._userName = nombreUsuario;
    }
    set contrasenia(contrasenia: string) {
        ValidateWaiterPartial({ contrasenia });
        this._password = contrasenia;
    }
    set nombre(nombre: string) {
        ValidateWaiterPartial({ nombre });
        this._name = nombre;
    }
    set apellido(apellido: string) {
        ValidateWaiterPartial({ apellido });
        this._lastName = apellido;
    }
    set dni(dni: string) {
        ValidateWaiterPartial({ dni });
        this._dni = dni;
    }
    set telefono(telefono: string) {
        ValidateWaiterPartial({ telefono });
        this._phone = telefono;
    }
    set email(email: string) {
        ValidateWaiterPartial({ email });
        this._email = email;
    }

}