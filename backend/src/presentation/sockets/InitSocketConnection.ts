import { Server as Http2Server} from 'node:http';
import { Server } from 'socket.io'
import { AuthenticatedSocket, AuthSocketMiddleware } from '../middlewares/AuthSocketMiddleware.js';
import { OrderController } from '../controllers/OrderController.js';
import { OrderLineStatus } from '../../domain/entities/OrderLine.js';
import { QRTokenRepository } from '../../infrastructure/database/repository/QRTokenRepository.js';
import { OrderLineSchema, PartialOrderMinimal } from '../../shared/validators/orderZod.js';

export function InitSocketConnection(server: Http2Server) {
    const ioConnection = new Server(server, {
      connectionStateRecovery: {
        maxDisconnectionDuration: 60000
      },
      cors: {
        origin: "*",
        credentials: true
      }
    });
      
    ioConnection.use(AuthSocketMiddleware);

    const orderController = new OrderController();
    const qrRepository = new QRTokenRepository();
  
    ioConnection.on('connection', async (socket: AuthenticatedSocket) => {
      if (socket.user?.tipoUsuario === "SectorCocina") {
        socket.join("cocina");
        const activeOrders = await orderController.getActiveOrders();
        socket.emit('activeOrders', activeOrders);
      }
      else if (socket.user?.tipoUsuario === "Mozo") {
        socket.join(`mozo:${socket.user.username}`);
        const waiterOrders = await orderController.getOrdersByWaiter(socket.user.idUsuario);
        socket.emit('waiterOrders', waiterOrders);
      }
      else if (socket.qrToken) socket.join(`comensal:${socket.qrToken}`);

      socket.on('updateLineStatus', async ({idPedido, nroLinea, estadoLP}: {idPedido: number, nroLinea: number, estadoLP: OrderLineStatus}) => {
        
        const order = await orderController.updateOrderLineStatus(idPedido, nroLinea, estadoLP)

        if (order){
          const tokenQRData = await qrRepository.getQRByTableNumber(order.table!.tableNum)
          if(tokenQRData){
            ioConnection.to(`comensal:${tokenQRData.tokenQR}`)
              .emit('updatedLine', order.toClientInfo());

            ioConnection.to('cocina')
              .emit('updatedLine', order.toKitchenInfo());

            ioConnection.to(`mozo:${order.waiter?.username}`)
              .emit('updatedLine', order.toWaiterInfo());
          } else {
            ioConnection.to('cocina')
              .emit('updatedLine', order.toKitchenInfo());
            
            ioConnection.to(`mozo:${order.waiter?.username}`)
              .emit('updatedLine', order.toWaiterInfo());
          }
        } else {
          ioConnection
            .to('cocina')
            .emit('updatedLineError', "No se pudo actualizar el pedido")
        }
      })

      socket.on('addOrderLine', async ({orderId, orderLines}: {orderId: number, orderLines: OrderLineSchema[]}) => {

        const order = await orderController.addOrderLine(orderId, orderLines)
        
        if (order){
          const tokenQRData = await qrRepository.getQRByTableNumber(order.table!.tableNum)
          if(tokenQRData){
            ioConnection.to(`comensal:${tokenQRData.tokenQR}`)
              .emit('addedOrderLine', order.toClientInfo());

            ioConnection.to('cocina')
              .emit('addedOrderLine', order.toKitchenInfo());

            ioConnection.to(`mozo:${order.waiter?.username}`)
              .emit('addedOrderLine', order.toWaiterInfo());
          } else {
            ioConnection.to('cocina')
              .emit('addedOrderLine', order.toKitchenInfo());
            
            ioConnection.to(`mozo:${order.waiter?.username}`)
              .emit('addedOrderLine', order.toWaiterInfo());
          }
        } else {
          ioConnection
            .to('cocina')
            .emit('addedOrderLine', "No se pudo agregar la linea")
        }
      })

      socket.on('modifyOrder', async ({orderId, lineNumbers, data}: {orderId: number, lineNumbers: number[] | undefined, data: Partial<PartialOrderMinimal>}) => {

        const order = await orderController.updateOrder(orderId, lineNumbers, data)

        if (order){
          const tokenQRData = await qrRepository.getQRByTableNumber(order.table!.tableNum)
          if(tokenQRData){
            ioConnection.to(`comensal:${tokenQRData.tokenQR}`)
              .emit('modifiedOrderLine', order.toClientInfo());

            ioConnection.to('cocina')
              .emit('modifiedOrderLine', order.toKitchenInfo());

            ioConnection.to(`mozo:${order.waiter?.username}`)
              .emit('modifiedOrderLine', order.toWaiterInfo());
          } else {
            ioConnection.to('cocina')
              .emit('modifiedOrderLine', order.toKitchenInfo());
            
            ioConnection.to(`mozo:${order.waiter?.username}`)
              .emit('modifiedOrderLine', order.toWaiterInfo());
          }
        } else {
          ioConnection
            .to('cocina')
            .emit('modifiedOrderLine', "No se pudo modificar la linea")
        }
      })


      socket.on('deleteOrderLine', async ({orderId, lineNumber}: {orderId: number, lineNumber: number}) => {
        
        const order = await orderController.deleteOrderLine(orderId, lineNumber)

        if (order){
          const tokenQRData = await qrRepository.getQRByTableNumber(order.table!.tableNum)
          if(tokenQRData){
            ioConnection.to(`comensal:${tokenQRData.tokenQR}`)
              .emit('deletedOrderLine', order.toClientInfo());

            ioConnection.to('cocina')
              .emit('deletedOrderLine', order.toKitchenInfo());

            ioConnection.to(`mozo:${order.waiter?.username}`)
              .emit('deletedOrderLine', order.toWaiterInfo());
          } else {
            ioConnection.to('cocina')
              .emit('deletedOrderLine', order.toKitchenInfo());
            
            ioConnection.to(`mozo:${order.waiter?.username}`)
              .emit('deletedOrderLine', order.toWaiterInfo());
          }
        } else {
          ioConnection
            .to('cocina')
            .emit('deletedOrderLine', "No se pudo eliminar la linea")
        }
      })
    
    });

    
    return ioConnection
}

