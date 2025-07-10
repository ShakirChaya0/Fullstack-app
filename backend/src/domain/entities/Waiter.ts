import { ValidateWaiter, ValidateWaiterPartial } from "../../shared/validators/waiterZod.js";

export class Waiter {
    constructor(
        private readonly _waiterId: string,
        private _userName: string,
        private _password: string,
        private _name: string,
        private _lastName: string,
        private _DNI: number,
        private _phone: string,
        private _email: string
    ) { ValidateWaiter(this) }

    get idMozo(): string {
        return this._waiterId;
    }
    get nombreUsuario(): string {
        return this._userName;
    }
    get contrasenia(): string {
        return this._password;
    }
    get nombre(): string {
        return this._name;
    }
    get apellido(): string {
        return this._lastName;
    }
    get DNI(): number {
        return this._DNI;
    }
    get telefono(): string {
        return this._phone;
    }
    get email(): string {
        return this._email;
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
    set DNI(DNI: number) {
        ValidateWaiterPartial({ DNI });
        this._DNI = DNI;
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