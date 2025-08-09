import { Server as Http2Server} from 'node:http';
import { Server } from 'socket.io'
import { AuthenticatedSocket, AuthSocketMiddleware } from '../middlewares/AuthSocketMiddleware.js';
import { OrderController } from '../controllers/OrderController.js';
import { OrderLineStatus } from '../../domain/entities/OrderLine.js';
import { QRTokenRepository } from '../../infrastructure/database/repository/QRTokenRepository.js';
import { Console } from 'node:console';


export function InitSocketConnection(server: Http2Server) {
    const ioConnection = new Server(server, {
        cors: {
          origin: "*",
          credentials: true
        }
    });
      
    ioConnection.use(AuthSocketMiddleware);

    const orderController = new OrderController();
    const qrRepository = new QRTokenRepository();
  
    ioConnection.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.user?.tipoUsuario === "SectorCocina") socket.join("cocina");
      else if (socket.user?.tipoUsuario === "Mozo") socket.join(`mozo:${socket.user.username}`);
      else if (socket.qrToken) socket.join(`comensal:${socket.qrToken}`);

      socket.on('updateLineStatus', async ({idPedido, nroLinea, estadoLP}: {idPedido: number, nroLinea: number, estadoLP: OrderLineStatus}) => {
        
        const order = await orderController.updateOrderLineStatus(idPedido, nroLinea, estadoLP)

        if (order){
          const tokenQRData = await qrRepository.getQRByTableNumber(order.table!.nroMesa)
          if(tokenQRData){
            ioConnection
              .to(`comensal:${tokenQRData.tokenQR}`)
              .to('cocina')
              .to(`mozo:${order.waiter?.username}`)
              .emit('updatedLine', order)
          } else {
              ioConnection
              .to('cocina')
              .to(`mozo:${order?.waiter?.username}`)
              .emit('updatedLine', order)
          }
        } else {
          
          ioConnection
            .to('cocina')
            .emit('updatedLineError', "No se pudo actualizar el pedido")
        }
      })
    });

    return ioConnection
}

