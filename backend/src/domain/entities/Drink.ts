import { ProductState } from "../../shared/types/SharedTypes.js";
import { Product } from "./Product.js";

export class Drink extends Product {
    constructor(
        productId: number,
        name: string,
        description: string,
        state: ProductState,
        price: number,
        private _isAlcoholic: boolean
    ) {
        super(productId, name, description, state, price);
    }

    public get isAlcoholic() { return this._isAlcoholic }

    public set isAlcoholic(alcoholic: boolean) { this._isAlcoholic = alcoholic }
} 