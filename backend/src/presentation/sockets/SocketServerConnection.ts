import { Server as HttpServer} from 'node:http';
import { Server } from 'socket.io'
import { AuthenticatedSocket, AuthSocketMiddleware } from '../middlewares/AuthSocketMiddleware.js';
import { OrderController } from '../controllers/OrderController.js';
import { registerOrderHandlers } from './handlers/OrderHandler.js';

export let ioConnection: Server;

export function SocketServerConnection(server: HttpServer) {
    ioConnection = new Server(server, {
        connectionStateRecovery: {
            maxDisconnectionDuration: 1000 * 60
        },
        cors: {
            origin: [
                process.env.FRONTEND_URL?.trim(),
                'https://sabores-deluxe-restaurante.vercel.app',
                'http://localhost:3000',
                'http://localhost:5173'
            ].filter(Boolean) as string[],
            credentials: true,
            methods: ['GET', 'POST']
        }
    });
      
    ioConnection.use(AuthSocketMiddleware);

    const orderController = new OrderController();

    ioConnection.on('connection', async (socket: AuthenticatedSocket) => {
        if (socket.user?.tipoUsuario === "SectorCocina") {
            socket.join("cocina");

            const activeOrders = await orderController.getActiveOrders();
            socket.emit('activeOrders', activeOrders);
        }
        else if (socket.user?.tipoUsuario === "Mozo") {
            const room = `mozo:${socket.user.username}`;
            const globalRoom = "mozos"
            socket.join(room);
            socket.join(globalRoom)

            const waiterOrders = await orderController.getOrdersByWaiter(socket.user.idUsuario);
            socket.emit('waiterOrders', waiterOrders);
        }
        else if (socket.qrToken) {
            const room = `comensal:${socket.qrToken}`;
            socket.join(room);
        } 

        registerOrderHandlers(ioConnection, socket);
    });
    
    return ioConnection;
}

