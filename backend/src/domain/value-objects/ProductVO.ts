import { Decimal } from "@prisma/client/runtime/library";
import { FoodType } from "../entities/Product.js";


export class ProductoVO {
    constructor(
        private _nombreProducto: string,
        private _monto: Decimal,
        private _tipoComida: FoodType
    ) {}

    get nombreProducto(): string {
        return this._nombreProducto;
    }

    get monto(): Decimal {
        return this._monto;
    }

    get tipoComida(): FoodType {
        return this._tipoComida;
    }

    set nombreProducto(nombreProducto: string) { this._nombreProducto = nombreProducto; }
    set monto(monto: Decimal) { this._monto = monto; }
    set tipoComida(tipoComida: FoodType) { this._tipoComida = tipoComida; }
    
}
