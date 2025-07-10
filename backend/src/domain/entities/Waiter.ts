import { ValidateWaiter, ValidateWaiterPartial } from "../../shared/validators/waiterZod.js";

export class Waiter {
    constructor(
        private readonly _waiterId: number,
        private _userName: string,
        private _password: string,
        private _name: string,
        private _lastName: string,
        private _DNI: number,
        private _phone: string,
        private _email: string
    ) { ValidateWaiter(this) }

    get waiterId(): number {
        return this._waiterId;
    }
    get userName(): string {
        return this._userName;
    }
    get password(): string {
        return this._password;
    }
    get name(): string {
        return this._name;
    }
    get lastName(): string {
        return this._lastName;
    }
    get DNI(): number {
        return this._DNI;
    }
    get phone(): string {
        return this._phone;
    }
    get email(): string {
        return this._email;
    }

    set userName(nombreUsuario: string) {
        ValidateWaiterPartial({ nombreUsuario});
        this._userName = nombreUsuario;
    }
    set password(contrasenia: string) {
        ValidateWaiterPartial({ contrasenia });
        this._password = contrasenia;
    }
    set name(nombre: string) {
        ValidateWaiterPartial({ nombre });
        this._name = nombre;
    }
    set lastName(apellido: string) {
        ValidateWaiterPartial({ apellido });
        this._lastName = apellido;
    }
    set DNI(DNI: number) {
        ValidateWaiterPartial({ DNI });
        this._DNI = DNI;
    }
    set phone(telefono: string) {
        ValidateWaiterPartial({ telefono });
        this._phone = telefono;
    }
    set email(email: string) {
        ValidateWaiterPartial({ email });
        this._email = email;
    }

}