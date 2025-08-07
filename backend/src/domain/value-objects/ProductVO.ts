import { FoodType } from "../entities/Product.js";

export class ProductoVO {
    constructor(
        private _productName: string,
        private _amount: number,
        private _foodType: FoodType | null
    ) {}

    get productName(): string {
        return this._productName;
    }

    get amount(): number {
        return this._amount;
    }

    get foodType(): FoodType | null {
        return this._foodType;
    }    
}