import { ProductState } from "../../shared/types/SharedTypes.js"

export abstract class Product {
    constructor (
        protected readonly _productId: number,
        protected _name: string,
        protected _description: string,
        protected _state: ProductState,
        protected _price: number
    ) {}

    public get productId() { return this._productId }
    public get name() { return this._name }
    public get description() { return this._description }
    public get state() { return this._state }
    public get price() { return this._price }

    public set name(name: string) { this._name = name }
    public set description(description: string) { this._description = description }
    public set state(state: ProductState) { this._state = state }
    public set price(price: number) { this._price = price}
}



