import { Server } from "socket.io";
import { OrderController } from "../../presentation/controllers/OrderController.js";
import { QRTokenRepository } from "../../infrastructure/database/repository/QRTokenRepository.js";
import { OrderLineStatus } from "../../domain/entities/OrderLine.js";
import { OrderLineSchema, PartialOrderMinimal } from "../../shared/validators/OrderZod.js";

export class OrderSocketService {
    private orderController = new OrderController();
    private qrRepository = new QRTokenRepository();

    constructor(
        private readonly io: Server
    ) {}

    public async updateLineStatus(orderId: number, orderLines: number, estadoLP: OrderLineStatus) {
        const order = await this.orderController.updateOrderLineStatus(orderId, orderLines, estadoLP)

        if (order){
            const tokenQRData = await this.qrRepository.getQRByTableNumber(order.table!.tableNum)
            if(tokenQRData){
                this.io.to(`comensal:${tokenQRData.tokenQR}`)
                    .emit('updatedLine', order.toClientInfo());
                
                this.io.to('cocina')
                    .emit('updatedLine', order.toKitchenInfo());
                
                this.io.to(`mozo:${order.waiter?.username}`)
                    .emit('updatedLine', order.toWaiterInfo());
            } else {
                this.io.to('cocina')
                    .emit('updatedLine', order.toKitchenInfo());

                this.io.to(`mozo:${order.waiter?.username}`)
                    .emit('updatedLine', order.toWaiterInfo());
            }
        } else {
            this.io
                .to('cocina')
                .emit('updatedLineError', "No se pudo actualizar el pedido")
        }
    }

    public async addOrderLine(orderId: number, orderLines: OrderLineSchema[]) {
        const order = await this.orderController.addOrderLine(orderId, orderLines)
        
        if (order){
            const tokenQRData = await this.qrRepository.getQRByTableNumber(order.table!.tableNum)
            if(tokenQRData){
                this.io.to(`comensal:${tokenQRData.tokenQR}`)
                    .emit('addedOrderLine', order.toClientInfo());
                
                this.io.to('cocina')
                    .emit('addedOrderLine', order.toKitchenInfo());
                
                this.io.to(`mozo:${order.waiter?.username}`)
                    .emit('addedOrderLine', order.toWaiterInfo());
            } else {
                this.io.to('cocina')
                    .emit('addedOrderLine', order.toKitchenInfo());

                this.io.to(`mozo:${order.waiter?.username}`)
                    .emit('addedOrderLine', order.toWaiterInfo());
            }
        } else {
            this.io
                .to('cocina')
                .emit('addedOrderLine', "No se pudo agregar la linea")
        }
    }

    public async modifyOrder(orderId: number, lineNumbers: number[] | undefined, data: Partial<PartialOrderMinimal>) {
        const order = await this.orderController.updateOrder(orderId, lineNumbers, data)

        if (order){
            const tokenQRData = await this.qrRepository.getQRByTableNumber(order.table!.tableNum)
            if(tokenQRData){
                this.io.to(`comensal:${tokenQRData.tokenQR}`)
                    .emit('modifiedOrderLine', order.toClientInfo());
                
                this.io.to('cocina')
                    .emit('modifiedOrderLine', order.toKitchenInfo());
                
                this.io.to(`mozo:${order.waiter?.username}`)
                    .emit('modifiedOrderLine', order.toWaiterInfo());
            } else {
                this.io.to('cocina')
                    .emit('modifiedOrderLine', order.toKitchenInfo());

                this.io.to(`mozo:${order.waiter?.username}`)
                    .emit('modifiedOrderLine', order.toWaiterInfo());
            }
        } else {
            this.io
                .to('cocina')
                .emit('modifiedOrderLine', "No se pudo modificar la linea")
        }
    }

    public async deleteOrderLine(orderId: number, lineNumber: number) {
        const order = await this.orderController.deleteOrderLine(orderId, lineNumber)

        if (order){
            const tokenQRData = await this.qrRepository.getQRByTableNumber(order.table!.tableNum)
            if(tokenQRData){
                this.io.to(`comensal:${tokenQRData.tokenQR}`)
                    .emit('deletedOrderLine', order.toClientInfo());

                this.io.to('cocina')
                    .emit('deletedOrderLine', order.toKitchenInfo());

                this.io.to(`mozo:${order.waiter?.username}`)
                    .emit('deletedOrderLine', order.toWaiterInfo());
            } else {
                this.io.to('cocina')
                    .emit('deletedOrderLine', order.toKitchenInfo());

                this.io.to(`mozo:${order.waiter?.username}`)
                    .emit('deletedOrderLine', order.toWaiterInfo());
            }
        } else {
            this.io
                .to('cocina')
                .emit('deletedOrderLine', "No se pudo eliminar la linea")
        }

    }
}