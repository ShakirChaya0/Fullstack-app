import { ValidateNews, ValidateNewsPartial } from "../../shared/validators/newsZod.js"

export class NewsClass {
    constructor (
        private readonly _newsId: number,
        private _title: string,
        private _description: string,
        private _startDate: string,
        private _endDate: string
    ){
        const result = ValidateNews({
            titulo: _title,
            descripcion: _description,
            fechaInicio: _startDate,
            fechaFin: _endDate,
        })

        if (!result.success) {
            throw new Error(result.error.errors.map(e => e.message).join(", "))
        }
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

    public set startDate(fechaInicio: string) { 
        ValidateNewsPartial({fechaInicio})
        this._startDate = fechaInicio 
    }
    
    public set endDate(fechaFin: string) { 
        ValidateNewsPartial({fechaFin})
        this._endDate = fechaFin 
    }

    private validar () {
        if(!this.isValidDate(this._startDate)) throw new Error("Formato de fecha no valido")
        if(!this.isValidDate(this._endDate)) throw new Error("Formato de fecha no valido")
            
        const start = new Date(this._startDate.replace('/', '-'))
        const end = new Date(this._endDate.replace('/', '-'))
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        if (start < hoy) {
          throw new Error("La fecha de inicio no puede ser anterior a la fecha actual")
        }
    
        if (end < start) {
          throw new Error("La fecha final no puede ser anterior a la fecha de inicio")
        }
    }
    private isValidDate (date: string){
        const regex = /^\d{4}\/\d{2}\/\d{2}$/
        return regex.test(date)
    }

}