import { FoodType, ProductState } from "../../shared/types/SharedTypes.js";
import { Product } from "./Product.js";

export class Food extends Product {
    constructor(
        productId: number,
        name: string,
        description: string,
        state: ProductState,
        price: number,
        private _isVegetarian: boolean,
        private _isVegan: boolean,
        private _isGlutenFree: boolean,
        private _type: FoodType
    ) {
        super(productId, name, description, state, price);
    }

    public get type() { return this._type }
    public get isVegetarian() { return this._isVegetarian }
    public get isVegan() { return this._isVegan }
    public get isGlutenFree() { return this._isGlutenFree }

    public set isVegetarian(isVegetarian: boolean) { this._isVegetarian = isVegetarian }
    public set isVegan(isVegan: boolean) { this._isVegan = isVegan }
    public set isGlutenFree(isGlutenFree: boolean) { this._isGlutenFree = isGlutenFree }
    public set type(type: FoodType) { this._type = type }
}