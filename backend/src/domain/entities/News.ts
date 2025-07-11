import { BusinessError } from "../../shared/exceptions/BusinessError.js"
import { ValidateNews } from "../../shared/validators/newsZod.js"

export class NewsClass {
    constructor (
        private readonly _newsId: number,
        private _title: string,
        private _description: string,
        private _startDate: Date,
        private _endDate: Date
    ){
        ValidateNews({
            titulo: _title,
            descripcion: _description,
            fechaInicio: _startDate,
            fechaFin: _endDate,
        })
        this.validar(this._startDate, this._endDate)
    }

    public get newsId() { return this._newsId }
    public get title() { return this._title }
    public get description() { return this._description }
    public get startDate() { return this._startDate }
    public get endDate() { return this._endDate }

    public set title(titulo: string) {this._title = titulo}

    public set description(descripcion: string) { this._description = descripcion}

    public set startDate(fechaInicio: Date) { this._startDate = fechaInicio }
    
    public set endDate(fechaFin: Date) { this._endDate = fechaFin }

    public validar (startDate: Date, endDate: Date) {
        const hoy = new Date();

        if (startDate < hoy) {
            throw new BusinessError("La fecha de inicio no puede ser anterior a la fecha actual");
        }

        if (endDate < startDate) {
            throw new BusinessError("La fecha final no puede ser anterior a la fecha de inicio");
        }
        return {startDate, endDate}
    }

}