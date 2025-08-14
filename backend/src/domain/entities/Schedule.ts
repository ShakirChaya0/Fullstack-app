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
}