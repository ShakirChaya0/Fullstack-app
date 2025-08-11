import { ValidateInformation, ValidatePartialInformation } from "../../shared/validators/Fix_informationZod.js";


export class Information {
    constructor(
        private readonly _informationId: number,
        private _name: string,
        private _address: string,
        private _CompanyName: string,
        private _telefono: string,
    ) { ValidateInformation(this) }

    public get idInformacion(): number {
        return this._informationId;
    }
    public get nombreRestaurante(): string {
        return this._name;
    }
    public get direccionRestaurante(): string {
        return this._address;
    }
    public get razonSocial(): string {
        return this._CompanyName;
    }
    public get telefonoContacto(): string {
        return this._telefono;
    }

    public set nombreRestaurante(nombreRestaurante: string) {
        ValidatePartialInformation({ nombreRestaurante });
        this._name = nombreRestaurante;
    }
    public set direccionRestaurante(direccionRestaurante: string) {
        ValidatePartialInformation({direccionRestaurante});
        this._address = direccionRestaurante;
    }
    public set razonSocial(razonSocial: string) {
        ValidatePartialInformation({razonSocial});
        this._CompanyName = razonSocial;
    }
    public set telefonoContacto(telefonoContacto: string) {
        ValidatePartialInformation({telefonoContacto});
        this._telefono = telefonoContacto;
    }

}