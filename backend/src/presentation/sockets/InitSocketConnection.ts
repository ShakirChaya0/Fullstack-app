import { Server as Http2Server} from 'node:http';
import { Server } from 'socket.io'
import { AuthenticatedSocket, AuthSocketMiddleware } from '../middlewares/AuthSocketMiddleware.js';

export function InitSocketConnection(server: Http2Server) {
    const ioConnection = new Server(server, {
        cors: {
          origin: "*",
          credentials: true
        }
    });
      
    ioConnection.use(AuthSocketMiddleware);
    

    ioConnection.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.user?.tipoUsuario === "SectorCocina") socket.join("cocina");
      else if (socket.user?.tipoUsuario === "Mozo") socket.join(`mozo:${socket.user.username}`);
      else if (socket.qrToken) socket.join(`comensal:${socket.qrToken}`);

    });

    return ioConnection
}

