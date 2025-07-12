export class Schedule {

    constructor(
        readonly diaSemana: number,
        private _horaApertura: string,
        private _horaCierre: string

    ) {}

    public get horaApertura(): string {
        return this._horaApertura;
    }

    public get horaCierre(): string {
        return this._horaCierre;
    }


    // public modificarHorarios(nuevaApertura: Date, nuevoCierre: Date): void {
    //     if (nuevaApertura >= nuevoCierre) {
    //         throw new Error("Opening time must be earlier than closing time");
    //     }
        
    //     this._horaApertura = nuevaApertura;
    //     this._horaCierre = nuevoCierre;
    // }
}