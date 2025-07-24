import { ProductoVO } from "../value-objects/ProductVO.js";

export type OrderLineStatus = 'Pendiente' | 'En Preparación' | 'Terminada';

export class OrderLine {
    constructor (
        private readonly _idPedido: number,
        private readonly _nroLinea: number,
        private _estado: OrderLineStatus,
        private _cantidad: number,
        private _productoVO: ProductoVO
    ){}

    get idPedido(): number {
        return this._idPedido;
    }

    get nroLinea(): number {
        return this._nroLinea;
    }

    get estado(): OrderLineStatus {
        return this._estado;
    }

    get cantidad(): number {
        return this._cantidad;
    }

    get productoVO(): any { // Cambiar
        return this._productoVO;
    }
}