export class Information {
    constructor(
        private readonly _informationId: number,
        private _name: string,
        private _address: string,
        private _CompanyName: string,
        private _telefono: string,
    ) {}

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
        this._name = nombreRestaurante;
    }

    public set direccionRestaurante(direccionRestaurante: string) {
        this._address = direccionRestaurante;
    }

    public set razonSocial(razonSocial: string) {
        this._CompanyName = razonSocial;
    }

    public set telefonoContacto(telefonoContacto: string) {
        this._telefono = telefonoContacto;
    }
}