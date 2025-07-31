import { ProductoVO } from "../value-objects/ProductVO.js";
export type OrderLineStatus = 'Pendiente' | 'En_Preparacion' | 'Terminada';

export class OrderLine {
    constructor (
        private readonly _lineNumber: number,
        private _status: OrderLineStatus,
        private _amount: number,
        private _productVO: ProductoVO
    ){}
    
    get lineNumber(): number {
        return this._lineNumber;
    }

    get status(): OrderLineStatus {
        return this._status;
    }

    get cantidad(): number {
        return this._amount;
    }

    get productoVO(): ProductoVO { 
        return this._productVO;
    }
}