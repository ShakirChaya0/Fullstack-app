export class Schedule {
    private _horaApertura: Date;
    private _horaCierre: Date;

    constructor(
        readonly idHorario: number,
        horaApertura: Date,
        horaCierre: Date

    ) {
        this._horaApertura = horaApertura;
        this._horaCierre = horaCierre;
        this.validarHorarios();
    }

    private validarHorarios(): void {
        if (this._horaApertura >= this._horaCierre) {
            throw new Error("Opening time must be earlier than Closing time");
        }
    }

    public get horaApertura(): Date {
        return this._horaApertura;
    }

    public get horaCierre(): Date {
        return this._horaCierre;
    }

    public set horaApertura(nuevaHora: Date) {
        if (nuevaHora >= this._horaCierre) {
            throw new Error("Opening time must be earlier than closing time");
        }
        this._horaApertura = nuevaHora;
    }

    public set horaCierre(nuevaHora: Date) {
        if (this._horaApertura >= nuevaHora) {
            throw new Error("Closing time must be later than opening time");
        }
        this._horaCierre = nuevaHora;
    }

    public modificarHorarios(nuevaApertura: Date, nuevoCierre: Date): void {
        if (nuevaApertura >= nuevoCierre) {
            throw new Error("Opening time must be earlier than closing time");
        }
        
        this._horaApertura = nuevaApertura;
        this._horaCierre = nuevoCierre;
    }
}