import { ValidationError } from "../../shared/exceptions/ValidationError.js";
import { Product } from "./Product.js";

export class Suggestion {
    constructor(
        private _product: Product,
        private _dateFrom: Date,
        private _dateTo: Date
    ) {
        if (_dateFrom > _dateTo) throw new ValidationError('La fecha de inicio no puede ser posterior a la fecha de fin');
    }

    public get product(): Product { return this._product }
    public get dateFrom(): Date { return this._dateFrom }
    public get dateTo(): Date { return this._dateTo }

    public set product(product: Product) { this._product = product }
    public set dateFrom(dateFrom: Date) { this._dateFrom = dateFrom }
    public set dateTo(dateTo: Date) { this._dateTo = dateTo }
}