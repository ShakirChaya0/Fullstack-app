import { Product } from "./Product.js";

export class Price {
    constructor(
        private readonly _product: Product,
        private readonly _dateFrom: Date,
        private readonly _amount: number
    ) {}

    public get product(): Product { return this._product }
    public get dateFrom(): Date { return this._dateFrom }
    public get amount(): number { return this._amount }
}