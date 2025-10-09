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
        
        console.log(`📡 Emitiendo evento: ${event} para pedido #${order.orderId}`);
        
        if (tokenQRData) {
            const room = `comensal:${tokenQRData.tokenQR}`;
            console.log(`📤 Emitiendo a sala: ${room}`);
            this.eventEmitter.emitToRoom(room, event, order.toClientInfo());
        } else {
            console.warn('⚠️ No se encontró token QR para la mesa');
        }

        this.eventEmitter.emitToRoom('cocina', event, order.toKitchenInfo());
        this.eventEmitter.emitToRoom(`mozo:${order.waiter?.username}`, event, order.toWaiterInfo());
    } 
}

/*
    console.log(`📡 Emitiendo evento: ${event} para pedido #${order.idOrder}`);
    
    if (tokenQRData) {
        const room = `comensal:${tokenQRData.tokenQR}`;
        console.log(`📤 Emitiendo a sala: ${room}`);
        this.eventEmitter.emitToRoom(room, event, order.toClientInfo());
    } else {
        console.warn('⚠️ No se encontró token QR para la mesa');
    }
*/