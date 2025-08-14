import { OrderLineStatus } from "../../shared/types/SharedTypes.js";
import { ProductoVO } from "../value-objects/ProductVO.js";

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

    get amount(): number {
        return this._amount;
    }

    get productoVO(): ProductoVO { 
        return this._productVO;
    }

    public calculateSubtotal(): number {
        return this._amount * this._productVO.amount
    }
}