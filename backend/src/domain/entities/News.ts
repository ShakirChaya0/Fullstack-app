export class NewsClass {
    constructor (
        private readonly _newsId: number,
        private _title: string,
        private _description: string,
        private _startDate: Date,
        private _endDate: Date
    ) {}

    public get newsId() { return this._newsId }
    public get title() { return this._title }
    public get description() { return this._description }
    public get startDate() { return this._startDate }
    public get endDate() { return this._endDate }

    public set title(titulo: string) {this._title = titulo}

    public set description(descripcion: string) { this._description = descripcion}

    public set startDate(fechaInicio: Date) { this._startDate = fechaInicio }
    
    public set endDate(fechaFin: Date) { this._endDate = fechaFin }
}