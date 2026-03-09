import { QRTokenRepository } from "../../infrastructure/database/repository/QRTokenRepository.js";
import { Order } from "../../domain/entities/Order.js";
import { SocketIOEventEmitter } from "../../infrastructure/events/SocketIOEventEmitter.js";
import { ioConnection } from "../../presentation/sockets/SocketServerConnection.js";

type OrderEvent = "newOrder" | "updatedOrderStatus" | "updatedOrderLineStatus" | "addedOrderLine" | "modifiedOrderLine" | "deletedOrderLine" | "orderPaymentEvent"

export class OrderSocketService {
    constructor(
        private readonly qrRepository = new QRTokenRepository(),
        private readonly eventEmitter = new SocketIOEventEmitter(ioConnection)
    ) {}

    public async emitOrderEvent(event: OrderEvent, order: Order) {
        const tokenQRData = await this.qrRepository.getQRByTableNumber(order.table!.tableNum);

        if (tokenQRData) {
            const room = `comensal:${tokenQRData.tokenQR}`;
            this.eventEmitter.emitToRoom(room, event, order.toClientInfo());
        }

        this.eventEmitter.emitToRoom('cocina', event, order.toKitchenInfo());
        this.eventEmitter.emitToRoom("mozos", event, order.toWaiterInfo());
    } 
}
