import { ioConnection } from "../../presentation/sockets/SocketServerConnection.js";

export class SocketIOEventEmitter {
    emitToRoom(room: string, event: string, payload: object) {
        ioConnection.to(room).emit(event, payload);
    }
}