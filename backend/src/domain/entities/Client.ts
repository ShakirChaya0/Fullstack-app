import { UUID } from "crypto";
import { User } from "./User.js";
import { ClientState } from "./ClientState.js";
import { Reservation } from "./Reservation.js";
import { UserType } from "../../shared/types/SharedTypes.js";

export class Client extends User {
    constructor(
        _userId: UUID,
        _userName: string,
        _email: string,
        _password: string,
        _userType: UserType,
        private _name: string,
        private _lastName: string,
        private _phone: string,
        private _birthDate: Date,
        private _emailVerified: boolean,
        private _states: ClientState[], 
        private _reservation: Reservation[]
    ) { 
        super(_userId, _userName, _email , _password, _userType);
    }

    get email(): string {
        return this._email;
    }

    get emailVerified(): boolean {
        return this._emailVerified;
    }
    
    get name(): string {
        return this._name;
    }

    get lastname(): string {
        return this._lastName;
    }

    get phone(): string {
        return this._phone;
    }

    get birthDate(): Date {
        return this._birthDate;
    }

    get states(): ClientState[] { 
        return this._states 
    }

    get reservation(): Reservation[] { 
        return this._reservation
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

    set emailVerified(bool: boolean) {
        this._emailVerified = bool;
    }

    set apellido(apellido: string) {
        this._lastName = apellido;
    }

    set telefono(telefono: string) {
        this._phone = telefono;
    }

    set email(email: string) {
        this._email = email;
    }

    set fechaNacimiento(fechaNacimiento: Date) {
        this._birthDate = fechaNacimiento;
    }

    set addState(nuevoEstado: ClientState){
        this._states.push(nuevoEstado);
    }

    set addReservation(newReservation: Reservation){
        this._reservation.push(newReservation);
    }

    public getActualState(): ClientState {
        return this.states[this.states.length - 1];
    }
}