import { ProductoVO } from "../value-objects/ProductVO.js";
export type OrderLineStatus = 'Pendiente' | 'En_Preparacion' | 'Terminada';

export class OrderLine {
    constructor (
        private readonly _lineNumber: number,
        private _state: OrderLineStatus,
        private _amount: number,
        private _productVO: ProductoVO
    ){}
    
    get nroLinea(): number {
        return this._lineNumber;
    }

    get estado(): OrderLineStatus {
        return this._state;
    }

    get cantidad(): number {
        return this._amount;
    }

    get productoVO(): ProductoVO { 
        return this._productVO;
    }
}