import { Server as Http2Server} from 'node:http';
import { Server } from 'socket.io'
import { AuthenticatedSocket, AuthSocketMiddleware } from '../middlewares/AuthSocketMiddleware.js';
import { OrderController } from '../controllers/OrderController.js';
import { registerOrderHandlers } from './handlers/OrderHandler.js';

export let ioConnection: Server;

export function SocketServerConnection(server: Http2Server) {
    const ioConnection = new Server(server, {
      connectionStateRecovery: {
        maxDisconnectionDuration: 1000 * 60
      },
      cors: {
        origin: "*",
        credentials: true
      }
    });
      
    ioConnection.use(AuthSocketMiddleware);

    const orderController = new OrderController();
  
    ioConnection.on('connection', async (socket: AuthenticatedSocket) => {
      if (socket.user?.tipoUsuario === "SectorCocina") {
        socket.join("cocina");
        // REVISAR: debería hacerse en otro lado
        const activeOrders = await orderController.getActiveOrders();
        socket.emit('activeOrders', activeOrders);
      }
      else if (socket.user?.tipoUsuario === "Mozo") {
        socket.join(`mozo:${socket.user.username}`);
        // REVISAR: debería hacerse en otro lado
        const waiterOrders = await orderController.getOrdersByWaiter(socket.user.idUsuario);
        socket.emit('waiterOrders', waiterOrders);
      }
      else if (socket.qrToken) {
        socket.join(`comensal:${socket.qrToken}`);
      }

      registerOrderHandlers(ioConnection, socket);
    });
    
    return ioConnection
}

