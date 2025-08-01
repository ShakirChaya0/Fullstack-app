import { Order } from "./Order.js";

export type PaymentMethod = "MercadoPago" | "Efectivo" | "Debito" | "Credito";

export class Payment {
    constructor (
        private readonly _paymentId: number,
        private readonly _order: Order,
        private _paymentMethod: PaymentMethod,
        private _paymentDate: Date,
        private _transactionId?: string
    ) {}

    get paymentId(): number { return this._paymentId }
    get order(): Order { return this._order };
    get paymentMethod(): PaymentMethod { return this._paymentMethod };
    get paymentDate(): Date { return this._paymentDate };
    get transactionId(): string | undefined { return this._transactionId };

    set paymentMethod(method: PaymentMethod) {
        this._paymentMethod = method;
    }
    
    set paymentDate(date: Date) {
        this._paymentDate = date;
    }

    set transactionId(id: string) {
        this._transactionId = id;
    }
}