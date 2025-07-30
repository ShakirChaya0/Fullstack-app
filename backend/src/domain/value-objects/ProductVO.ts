import { FoodType } from "../entities/Product.js";

export class ProductoVO {
    constructor(
        private _nombreProducto: string,
        private _monto: number,
        private _tipoComida: FoodType | null
    ) {}

    get nombreProducto(): string {
        return this._nombreProducto;
    }

    get monto(): number {
        return this._monto;
    }

    get tipoComida(): FoodType | null {
        return this._tipoComida;
    }    
}
