export class NewsClass {
    constructor (
        private readonly _newsId: number,
        private _title: string,
        private _description: string,
        private _startDate: string,
        private _endDate: string
    ){
        this.validar()
    }

    public get newsId() { return this._newsId }
    public get title() { return this._title }
    public get description() { return this._description }
    public get startDate() { return this._startDate }
    public get endDate() { return this._endDate }

    public set title(title: string) { this._title = title}

    public set description(description: string) { this._description = description}

    public set startDate(startDate: string) { this._startDate = startDate }
    
    public set endDate(endDate: string) { this._endDate = endDate }

    private validar () {
        if(this._title.length < 6) throw new Error("El titulo debe contener al menos 6 caracteres")
        if(this._description.length < 12) throw new Error("El titulo debe contener al menos 12 caracteres")
        if(!this.isValidDate(this._startDate)) throw new Error("Formato de fecha no valido")
        if(!this.isValidDate(this._endDate)) throw new Error("Formato de fecha no valido")
            
        const start = new Date(this._startDate.replace('/', '-'))
        const end = new Date(this._endDate.replace('/', '-'))
        const hoy = new Date()
        hoy.setHours(0, 0, 0, 0)

        if (start < hoy) {
          throw new Error("La fecha de inicio no puede ser anterior a la fecha actual");
        }
    
        if (end < start) {
          throw new Error("La fecha final no puede ser anterior a la fecha de inicio");
        }
    }
    private isValidDate (date: string){
        const regex = /^\d{4}\/\d{2}\/\d{2}$/;
        return regex.test(date);
    }

}