import { Server as HttpServer} from 'node:http';
import { Server } from 'socket.io'
import { AuthenticatedSocket, AuthSocketMiddleware } from '../middlewares/AuthSocketMiddleware.js';
import { OrderController } from '../controllers/OrderController.js';
import { registerOrderHandlers } from './handlers/OrderHandler.js';

export let ioConnection: Server;

export function SocketServerConnection(server: HttpServer) {
    console.log('Estoy socket server conecction')
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
    console.log('🔌 Nueva conexión - Socket ID:', socket.id);
    console.log('👤 Usuario:', socket.user?.username);
    console.log('🎫 QR Token:', socket.qrToken);

    if (socket.user?.tipoUsuario === "SectorCocina") {
        socket.join("cocina");
        console.log('👨‍🍳 Socket unido a sala: cocina');

        const activeOrders = await orderController.getActiveOrders();
        socket.emit('activeOrders', activeOrders);
    }
    else if (socket.user?.tipoUsuario === "Mozo") {
        const room = `mozo:${socket.user.username}`;
        const globalRoom = "mozos"
        socket.join(room);
        socket.join(globalRoom)
        console.log(`🧑‍💼 Socket unido a sala: ${room}, Room global ${globalRoom}`);

        const waiterOrders = await orderController.getOrdersByWaiter(socket.user.idUsuario);
        socket.emit('waiterOrders', waiterOrders);
    }
    else if (socket.qrToken) {
        const room = `comensal:${socket.qrToken}`;
        socket.join(room);
        console.log(`🍽️ Socket unido a sala: ${room}`); //   IMPORTANTE
        // Ver si corresponde recuperar su pedido solicitado
    } else {
        console.warn('⚠️ Socket sin tipo de usuario ni qrToken');
    }

    registerOrderHandlers(ioConnection, socket);
  });
    
    return ioConnection;
}

