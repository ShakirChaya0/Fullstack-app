import { ValidateNews, ValidateNewsPartial } from "../../shared/validators/newsZod.js"

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
        this.validar()
    }

    public get newsId() { return this._newsId }
    public get title() { return this._title }
    public get description() { return this._description }
    public get startDate() { return this._startDate }
    public get endDate() { return this._endDate }

    public set title(titulo: string) {
        ValidateNewsPartial({titulo})
        this._title = titulo
    }

    public set description(descripcion: string) { 
        ValidateNewsPartial({descripcion})
        this._description = descripcion
    }

    public set startDate(fechaInicio: Date) { 
        ValidateNewsPartial({fechaInicio})
        this._startDate = fechaInicio 
    }
    
    public set endDate(fechaFin: Date) { 
        ValidateNewsPartial({fechaFin})
        this._endDate = fechaFin 
    }

    private validar () {
        if (!(this._startDate instanceof Date) || isNaN(this._startDate.getTime())) {
            throw new Error("Fecha de inicio no válida");
        }
        if (!(this._endDate instanceof Date) || isNaN(this._endDate.getTime())) {
            throw new Error("Fecha final no válida");
        }

        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        if (this._startDate < hoy) {
            throw new Error("La fecha de inicio no puede ser anterior a la fecha actual");
        }

        if (this._endDate < this._startDate) {
            throw new Error("La fecha final no puede ser anterior a la fecha de inicio");
        }
    }

}